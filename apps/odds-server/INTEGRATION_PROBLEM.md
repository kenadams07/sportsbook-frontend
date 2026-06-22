# Odds Server Integration Problem

## Context

We now have a separate odds-server that owns the live sports odds flow.

The odds-server is responsible for:

- Fetching sports, events, markets, and odds from The Odds API.
- Registering sports and events in its own database.
- Storing odds snapshots in TimescaleDB.
- Publishing live odds deltas through Redis and WebSocket.
- Exposing frontend event and odds data to the client application.

At the same time, the existing sportsbook platform already has other backend services.

The important existing services are:

- `user-service`
- `admin-service`
- old `match-odds-service`

These existing services use a different PostgreSQL database from the new odds-server.

Current database ownership:

```text
odds-server
  DB: odds
  Port: 5433 locally
  ORM: Prisma
  Owns: Sport, Event, SportConfig, OddsSnapshot

user-service/admin-service
  DB: sportsbook
  Port: 5432 or remote production DB
  ORM: TypeORM
  Owns: users, balances, bets, transactions, admin data, old sports/events/markets/runners
```

## The Core Problem

The frontend is now receiving sports, events, and live odds from the new odds-server.

But when a user places a bet, that bet will be handled by the existing user-service and stored in the user-service database.

This creates an identity and ownership problem.

Example:

```text
Frontend shows:
sportKey = cricket_odi
eventId = abc123
market = h2h
outcome = India
price = 1.82

User places bet:
user-service stores eventId = abc123
```

But the user-service database may not contain:

- The sport with `sportKey = cricket_odi`
- The event with `eventId = abc123`
- The market `h2h`
- The outcome `India`
- The teams
- The commence time
- The event status
- The odds price accepted by the user

So the bet can become an orphan reference in the user-service database.

In simple terms:

```text
The user-service may store a bet for an event it does not know.
```

## Why This Is Dangerous

If only IDs are stored in the user-service database, many downstream flows can break.

### Bet History

The user may later open bet history.

If the user-service only has `eventId`, but no local event details, it cannot reliably show:

- Match name
- Home team
- Away team
- Sport name
- Market name
- Selected outcome
- Accepted odds

### Settlement

When a match result comes in, the system must know which open bets belong to that event and market.

If event identity is split across databases without a clear contract, settlement becomes fragile.

Questions:

- Which service decides the event is settled?
- Which event ID is used for settlement?
- Does user-service trust odds-server IDs?
- Does admin-service use the same event IDs?
- What happens if old `match-odds-service` IDs differ from odds-server IDs?

### Reports and Exposure

Admin reports and exposure calculations need event and market context.

For example:

```text
Show total exposure for India vs Australia, h2h, India.
```

If user-service only stores IDs and cannot join them to known event/market tables, reports become hard or inaccurate.

### Old Service Compatibility

The existing platform already has old sports/events/markets/runners tables.

Those tables may be based on the old `match-odds-service` flow.

The new odds-server uses The Odds API identifiers and its own internal model.

These IDs may not match the old IDs.

That means simply replacing frontend odds data is not enough. The betting backend also needs a stable mapping or a new contract.

### Data Retention

The odds-server stores odds history with TimescaleDB retention policies.

For example:

```text
OddsSnapshot retention = 30 days
```

But user bets and transaction records must usually be stored for much longer.

If old bet records depend on odds-server historical tables, then old bets may become unreadable after odds history cleanup.

## Why Using One Shared Database Is Not Automatically Safe

One idea is to configure user-service, admin-service, and odds-server to use the same PostgreSQL database.

This may look simple, but it can create new problems.

### ORM Conflict

The odds-server uses Prisma.

The existing services use TypeORM.

If both ORMs manage the same database schema, migrations can conflict.

Prisma migrations may create or alter tables that TypeORM does not expect.

TypeORM migrations may create or alter tables that Prisma does not expect.

### Table Meaning Conflict

The existing services already have tables like:

- sports
- events
- markets
- runners

The odds-server also has concepts like:

- Sport
- Event
- OddsSnapshot

Even if table names do not directly collide, the meaning of the data may differ.

Example:

```text
admin-service event ID may mean old provider event ID
odds-server event ID may mean The Odds API event ID
```

Using one database does not solve identity mismatch by itself.

### Retention Conflict

Odds data is high-volume time-series data.

Betting and transaction data is long-lived financial data.

They have different retention and backup needs.

Putting everything into one public schema can make data lifecycle management risky.

## The Actual Architectural Problem

The real problem is not only database location.

The real problem is:

```text
Which service owns the stable identity and details for sports, events, markets, and outcomes used in betting?
```

Right now:

- odds-server owns live event and odds identity.
- user-service owns bet placement and money movement.
- admin-service owns admin views and operational tools.

The boundaries are not yet fully connected.

## What Must Be Decided

Before final betting integration, we need to decide:

1. Should user-service trust odds-server as the source of truth for events and odds?
2. Should user-service store only IDs, or a full bet snapshot?
3. Should sports/events/markets be mirrored into the user-service database?
4. Should admin-service talk directly to odds-server or proxy through its own backend?
5. How will results and settlement map to odds-server events?
6. What happens to old `match-odds-service` IDs and existing betting tables?

## Recommended Direction

The safest immediate direction is:

```text
Keep odds-server as the source of truth for live odds.
Let user-service continue owning bets, balances, and transactions.
When a bet is placed, user-service must validate the selection against odds-server.
Then user-service must store a complete immutable bet snapshot.
```

The bet record should not store only IDs.

It should store enough event and odds information to remain readable and settleable later.

Minimum suggested bet snapshot:

```json
{
  "eventId": "abc123",
  "sportKey": "cricket_odi",
  "sportTitle": "Cricket ODI",
  "homeTeam": "India",
  "awayTeam": "Australia",
  "commenceTime": "2026-06-11T10:00:00Z",
  "market": "h2h",
  "outcome": "India",
  "bookmaker": "draftkings",
  "acceptedPrice": 1.82,
  "stake": 100,
  "potentialPayout": 182,
  "eventStatusAtPlacement": "LIVE",
  "placedAt": "2026-06-11T10:05:00Z"
}
```

## Recommended Bet Placement Flow

```text
1. Frontend displays event and odds from odds-server.
2. User selects an outcome and enters stake.
3. Frontend sends bet request to user-service.
4. user-service calls odds-server to validate the selected event, market, outcome, and price.
5. odds-server returns one of:
   - valid
   - price changed
   - event suspended
   - market unavailable
   - event not found
6. If valid, user-service stores the bet snapshot in its own DB.
7. user-service updates balance/exposure/transactions.
8. Settlement later uses the stored event identity and snapshot.
```

## Why Bet Snapshot Is Important

A bet is a historical financial record.

It must preserve what the user accepted at the moment of placement.

Even if odds change later, the accepted bet should still show:

- The exact match
- The exact market
- The exact selection
- The exact accepted price
- The exact stake and payout

This cannot depend only on live odds-server data.

## Later Improvement

After the basic flow is stable, we can add event mirroring.

That means:

```text
odds-server event upsert
-> publish event.updated
-> user-service/admin-service store lightweight EventMirror rows
```

This can make reporting and settlement easier, but it should not replace immutable bet snapshots.

## Current Conclusion

Do not merge all services into one database as the first fix.

Instead:

- Keep service ownership clear.
- Use odds-server for validation and live odds.
- Store full bet snapshots in user-service.
- Add event/result mapping deliberately.
- Only consider shared database or mirrored tables after the betting contract is clear.

