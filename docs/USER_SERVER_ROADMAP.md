# User Server Roadmap

This roadmap is based on the old NestJS `user-service` at:

```text
C:\Users\hp\Desktop\9x\sportbook-backend\sportsbook-frontend\user-service
```

The v2 target is:

```text
apps/user-server
Fastify
Prisma
shared PostgreSQL DB through packages/db
```

No NestJS and no TypeORM.

## Main Rule

The old service mixed user, betting, event, market, runner, result, and operational concerns in one NestJS service.

In v2, we should keep ownership cleaner:

```text
odds-server
  owns sports, events, markets/runners, odds, live status

user-server
  owns users, auth, wallets, bets, exposures, transactions, user bet history

admin-server
  owns admin controls, reports, settlement operations, risk/admin views
```

The user-server can read sports/events/markets from the shared DB, but it should not own live odds ingestion.

## Old User-Service Modules Found

Old modules/controllers:

- `users`
- `sportBets`
- `exposure`
- `resultTransaction`
- `currency`
- `sports`
- `events`
- `markets`
- `runners`
- `sportStakeSettings`
- `whiteLabel`
- `email`
- `test/msgqueue`

## V2 Module Mapping

### Keep In User-Server

These are core user-server responsibilities:

- users
- auth/session/profile
- login history
- wallet/balance
- bets
- exposure
- result transactions / ledger
- user-facing bet history
- currency lookup if required by user account/wallet
- email/OTP if user auth still depends on it

### Move Or Treat As Read-Only

These should not be rebuilt as user-server-owned master data:

- sports
- events
- markets
- runners

Reason:

The v2 odds-server already owns sports/events/odds ingestion. These tables should be part of the shared Prisma schema and primarily written by odds-server.

The user-server may read these tables to:

- validate bet placement
- show bet history context
- calculate exposure
- settle bets

### Likely Admin-Server Responsibilities

These should probably move to admin-server or be shared config:

- sport stake settings
- white label settings
- settlement controls
- market result controls
- reports

## Routes To Rebuild In User-Server

### Health

```text
GET /health
```

Purpose:

- confirm server is running
- confirm DB connection

### Auth And Users

Old routes:

```text
GET  /users
POST /users/signup
POST /users/login
POST /users/verifyemail
POST /users/forget-password
POST /users/verify-otp
GET  /users/profile
```

V2 proposed routes:

```text
GET  /users
POST /auth/signup
POST /auth/login
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/verify-otp
GET  /me
```

Notes:

- Passwords must be hashed with bcrypt.
- Do not store plain `passwordText` in v2 unless there is a hard business requirement.
- JWT secret and expiry should come from `packages/config`.
- Login history should be stored in a `LoginHistory` table.
- Profile should use auth middleware, not manually parse token in every handler.

### Currency

Old routes:

```text
GET  /currency
POST /currency
```

V2 proposed routes:

```text
GET  /currencies
POST /currencies
```

Owner decision:

- If currency is global admin-managed config, POST should move to admin-server.
- User-server can keep GET for account display and signup validation.

### Bets

Old routes:

```text
GET  /sportBets
GET  /sportBets/my-bets?userId=&eventId=
GET  /sportBets/all-bets?userId=
POST /sportBets
POST /sportBets/place-bet
POST /sportBets/settle-market
POST /sportBets/process-results
GET  /sportBets/match-results
GET  /sportBets/market-report
```

V2 proposed user-server routes:

```text
GET  /bets
GET  /bets/me
GET  /bets/me/events
GET  /bets/me/history
POST /bets/place
```

V2 proposed admin-server routes:

```text
GET  /admin/bets
POST /admin/bets/settle-market
POST /admin/bets/process-results
GET  /admin/bets/match-results
GET  /admin/reports/market
```

Reason:

Bet placement and user bet history belong to user-server.

Settlement, processing results, and market reports are operational/admin concerns and should not live in public user routes.

## Bet Placement Contract

This is the most important v2 flow.

Old service accepts `betData` and uses:

- `userId`
- `eventId`
- `sportsid`
- `marketId`
- `runnername`
- `odds`
- `stake`
- `marketType`
- `runners`

V2 must validate the selection against odds-server/shared DB before accepting the bet.

Suggested request:

```json
{
  "eventId": "abc123",
  "sportKey": "cricket_odi",
  "market": "h2h",
  "outcome": "India",
  "price": 1.82,
  "stake": 100,
  "selectionType": "BACK"
}
```

Suggested validation:

```text
1. Auth user from JWT.
2. Read user balance/exposure.
3. Read current event/market/outcome from shared DB or odds-server validation service.
4. Reject if event is not LIVE/PRE_MATCH as allowed.
5. Reject if market/outcome is suspended/unavailable.
6. Reject if price changed beyond allowed tolerance.
7. Calculate exposure.
8. Save bet and exposure in one Prisma transaction.
9. Return accepted bet snapshot.
```

The bet row must store both IDs and immutable snapshot fields.

Minimum bet snapshot fields:

```text
userId
sportKey
sportTitle
eventId
homeTeam
awayTeam
commenceTime
market
marketName
outcome
selectionType
acceptedPrice
stake
potentialPayout
status
eventStatusAtPlacement
placedAt
```

Reason:

A bet is a historical financial record. It must remain understandable even if odds/events change later.

## Exposure

Old routes:

```text
GET  /exposures
POST /exposures
```

V2 proposed routes:

```text
GET /exposures/me
GET /exposures/me/:eventId
```

Admin routes should live in admin-server:

```text
GET /admin/exposures
GET /admin/exposures/users/:userId
```

Notes:

- Exposure should be calculated during bet placement.
- User total exposure should be updated in the same transaction as bet placement.
- Existing logic calculates exposure per user + market + event.
- We should extract the exposure calculation into a pure function and unit test it before wiring DB writes.

## Result Transactions / Ledger

Old routes:

```text
GET  /resultTransaction
POST /resultTransaction
```

V2 proposed routes:

```text
GET /ledger/me
GET /ledger/me/markets/:marketId
```

Admin routes:

```text
GET  /admin/result-transactions
POST /admin/result-transactions
```

Notes:

- Settlement should create result transaction rows.
- Ledger/report APIs should read from result transactions.
- Money movement should happen inside Prisma transactions.

## Sports / Events / Markets / Runners

Old routes:

```text
GET  /sports
POST /sports
GET  /events
POST /events
GET  /markets
POST /markets
GET  /runners
POST /runners
```

V2 direction:

Do not rebuild these as user-server-owned CRUD routes.

Use odds-server for live/user-facing sports/events data:

```text
GET /frontend/events/:sportKey
WebSocket odds stream
```

If user-server needs internal reads, it reads shared DB tables through Prisma.

If admin needs CRUD/control, build it in admin-server.

## Email / OTP

Old routes:

```text
POST /email/send-otp
POST /email/send-welcome
POST /email/send-password-reset
```

V2 direction:

Keep internal email service in user-server.

Public routes should be auth-focused:

```text
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/verify-otp
```

Direct `/email/*` routes should be avoided unless admin/internal-only.

## WebSocket / Realtime

Old service had `AppGateway` and emitted exposure updates.

V2 options:

1. Start without WebSocket in user-server.
2. Add user websocket later for balance/exposure updates.
3. Keep odds websocket in odds-server only.

Recommended initial v2:

```text
odds-server websocket -> live odds
user-server HTTP      -> auth, profile, bet placement, bet history
```

Add user-server websocket only after bet placement and exposure are stable.

## Prisma Models Needed

Initial user-server models:

```text
User
LoginHistory
Currency
Bet
Exposure
ResultTransaction
```

Shared/odds-owned models already started:

```text
Sport
Event
OddsSnapshot
SportConfig
```

Likely additions/changes needed:

```text
Market
Runner / Outcome
WalletTransaction
AdminAuditLog
WhiteLabel
SportStakeSetting
```

## Build Order

### Phase 1 - User Server Foundation

- [x] Add config values for `USER_SERVER_PORT`, JWT secret, CORS origins.
- [ ] Add shared logger implementation.
- [x] Build Fastify bootstrap for user-server.
- [x] Add `/health`.
- [x] Add common response helpers.
- [x] Add auth middleware/helper for Bearer token.

### Phase 2 - Prisma User Models

- [x] Add `User`.
- [x] Add `LoginHistory`.
- [x] Add `Currency`.
- [x] Generate migration from `packages/db`.
- [x] Build user repository/service.

### Phase 3 - Auth

- [x] `POST /auth/signup`
- [x] `POST /auth/login`
- [x] `GET /me`
- [x] `POST /auth/verify-email`
- [x] `POST /auth/forgot-password`
- [x] `POST /auth/verify-otp`

### Phase 4 - Betting Core

- [x] Add `Bet`.
- [x] Add immutable bet snapshot fields.
- [x] Add `Exposure`.
- [x] Extract exposure calculation.
- [x] `POST /bets/place`
- [x] `GET /bets/me`
- [x] Legacy bet history aliases for `/sportBets/my-bets` and `/sportBets/all-bets`
- [ ] New explicit `GET /bets/me/history`

### Phase 5 - Settlement And Ledger

- [x] Add `ResultTransaction`.
- [x] Add settlement service.
- [x] Add ledger/report routes in user-server for compatibility.
- [ ] Move admin settlement routes into admin-server when admin work starts.

### Phase 6 - Cleanup Old Integration

- [ ] Remove dependency on old remote `http://46.202.166.160:3009/events`.
- [ ] Remove dependency on old remote `http://46.202.166.160:3009/result`.
- [ ] Replace old match-odds-service assumptions with shared DB/odds-server reads.
- [ ] Add Docker setup for all three services.

## Immediate Next Step

Before writing user routes, add the user-related Prisma models to `packages/db/prisma/schema.prisma`.

Start with:

```text
User
LoginHistory
Currency
```

Then bootstrap user-server `/health`, `/auth/signup`, `/auth/login`, and `/me`.
