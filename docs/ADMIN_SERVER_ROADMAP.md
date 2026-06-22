# Admin Server Roadmap

This checklist defines the Fastify + Prisma admin backend for the shared sportsbook database.

## Service Ownership

| Area | Owning service | Admin server responsibility |
| --- | --- | --- |
| Odds provider, polling, snapshots, WebSocket publishing | `odds-server` | Call/control its admin APIs; do not duplicate provider ingestion. |
| User identity, user bets, wallet and exposure | `user-server` | Read and administer business state through shared Prisma models and explicit service APIs. |
| Operations console | `admin-server` | Admin authentication, permissions, configuration, risk controls, settlement actions, reports, audit trail. |

Rules:

- The admin server must never call The Odds API directly.
- `odds-server` remains the only owner of provider sync, quota, polling and odds publication.
- Monetary, exposure, settlement and status mutations must use transactions and create an audit entry.
- Avoid a second conflicting migration history. Prisma schema and migrations are owned centrally in `packages/db`.

## API Contract

- [ ] Protect every `/admin/*` route with JWT authentication and role-based authorization.
- [ ] Allow only role `1` (admin) to log in to the admin console in v1.
- [ ] Use the standard response envelope: `{ success, message, data, meta: { statusCode } }`.
- [ ] Return correct HTTP status codes; never return `200` for failed mutations.
- [ ] Add pagination to every list endpoint: `limit`, `offset`, `total`.
- [ ] Add searchable/filterable query schemas through Fastify validation.
- [ ] Redact password hashes, tokens, OTPs and secrets from all responses/logs.
- [ ] Publish an OpenAPI/Swagger contract or maintain endpoint documentation.

## Phase 0: Foundation

- [x] Workspace created at `apps/admin-server`.
- [ ] Fastify server bootstrap, config validation and Pino logger.
- [ ] Shared Prisma client from `packages/db`.
- [ ] Central error handler and standard API response helpers.
- [ ] CORS allow-list for the admin frontend.
- [ ] Health endpoint: `GET /health`.
- [ ] Readiness endpoint: database/Redis dependency checks.
- [ ] Graceful shutdown for HTTP server, DB and Redis clients.
- [ ] Admin route registration and module folder structure.
- [ ] Environment example and startup documentation.

## Phase 1: Admin Authentication and Access

- [ ] `POST /admin/auth/login`.
- [ ] Check user is verified, active and has role `1`.
- [ ] Issue an admin JWT with explicit `role`, `userId`, `username` and expiry.
- [ ] `GET /admin/auth/me`.
- [ ] `POST /admin/auth/logout` if token revocation/session tracking is introduced.
- [ ] Password hashing and login failure handling.
- [ ] Login rate limiting and audit logging.
- [ ] Optional later: MFA/OTP for admin accounts.
- [ ] Optional later: granular permissions for master/manager/operator roles.

## Phase 2: Admin Dashboard

- [ ] `GET /admin/dashboard/summary`.
- [ ] Active users, blocked users and newly registered users.
- [ ] Open bets, unsettled events and suspended markets.
- [ ] Total exposure and largest event/market liabilities.
- [ ] Wallet totals: deposits, withdrawals, credit and debit totals.
- [ ] Odds health: configured leagues, active pollers, connected WebSocket clients.
- [ ] Odds quota summary from odds-server.
- [ ] Recent admin actions and recent system failures.

## Phase 3: User Administration

- [ ] `GET /admin/users` with search, role, verification, status and date filters.
- [ ] `GET /admin/users/:userId` profile, wallet, exposure, current bets and history.
- [ ] `PATCH /admin/users/:userId/status` for activate/block/unblock.
- [ ] `PATCH /admin/users/:userId/role` with role-change safeguards.
- [ ] `PATCH /admin/users/:userId/verification` for controlled manual verification.
- [ ] `POST /admin/users/:userId/password-reset` or support reset workflow.
- [ ] User login/device/IP history when model support is added.
- [ ] Record every admin action against a user in the audit log.

## Phase 4: Wallet and Finance Controls

- [ ] `GET /admin/wallets` and wallet transaction history.
- [ ] `GET /admin/users/:userId/wallet`.
- [ ] `POST /admin/users/:userId/wallet/credit`.
- [ ] `POST /admin/users/:userId/wallet/debit`.
- [ ] Require idempotency key, reason, amount and admin note for manual adjustments.
- [ ] Prevent negative balances unless a product rule explicitly permits it.
- [ ] Persist immutable wallet ledger entries; never only update balance.
- [ ] `GET /admin/transactions` with user/type/date/status filters.
- [ ] Deposit/withdrawal approval flow if those payment features are enabled.
- [ ] Reconciliation report: wallet balance versus ledger total.

## Phase 5: Sports, Leagues and Polling Controls

These controls integrate with existing `odds-server` endpoints and tables.

- [x] Restore panel supports sport category, league, region and market configuration.
- [x] Event sync and provider market discovery are handled by `odds-server`.
- [ ] Admin-server authorization layer for odds-server control actions.
- [ ] `GET /admin/odds/sports` aggregated admin view.
- [ ] `PATCH /admin/odds/leagues/:leagueKey/settings` proxy/service facade.
- [ ] Pause/resume league polling.
- [ ] Force poll with role check, rate limit and quota warning.
- [ ] View polling interval, regions, configured markets and latest successful poll.
- [ ] View provider quota, pause state and ingestion errors.
- [ ] Keep event status override/release controls available only to authorized admins.

## Phase 6: Event, Market and Outcome Controls

- [ ] `GET /admin/events` with league, status, date and market filters.
- [ ] `GET /admin/events/:eventId` including markets, outcomes, odds snapshot and current liability.
- [ ] Set/release event status override: pre-match, live, settled, postponed, cancelled.
- [ ] Suspend/open/close an event.
- [ ] Suspend/open/close individual markets.
- [ ] Activate/deactivate individual outcomes.
- [ ] Set market-level max stake and max liability.
- [ ] Set event-level max stake and max liability.
- [ ] Store reason and audit entry for every operational override.
- [ ] Ensure manual status controls are never overwritten by provider sync until released.

## Phase 7: Betting, Exposure and Risk

- [ ] `GET /admin/bets` with user, event, market, status and date filters.
- [ ] `GET /admin/bets/:betId` detailed bet and placement-time odds context.
- [ ] `GET /admin/exposure` grouped by user, event, market and outcome.
- [ ] `GET /admin/exposure/events/:eventId` outcome-level liability matrix.
- [ ] Global, sport, league, event and market stake-limit configuration.
- [ ] Max payout and max liability configuration.
- [ ] Bet acceptance controls: open, suspend and disable per scope.
- [ ] Void/cancel a pending bet only through a transaction and audit trail.
- [ ] Exposure recalculation command for repair, restricted to super-admin operations.
- [ ] Alerts for exposure above configured thresholds.

## Phase 8: Results and Settlement

- [ ] Result entry/import model and result status workflow.
- [ ] `POST /admin/events/:eventId/results`.
- [ ] Validate that result data matches event/market/outcome structure.
- [ ] Preview settlement impact before executing it.
- [ ] `POST /admin/events/:eventId/settle`.
- [ ] Settle winning, losing, void and cancelled bets in one transaction boundary.
- [ ] Create immutable `ResultTransaction` and wallet ledger records.
- [ ] Update wallet balance and exposure safely.
- [ ] Settlement idempotency: repeat requests must not pay twice.
- [ ] Admin-only rollback/correction flow with explicit reason and audit record.
- [ ] Support provider result ingestion later; manual settlement remains the v1 fallback.

## Phase 9: Reports and Operations

- [ ] `GET /admin/reports/bets`.
- [ ] `GET /admin/reports/profit-loss` by sport, league, event, market and user.
- [ ] `GET /admin/reports/turnover` by date range.
- [ ] `GET /admin/reports/exposure` current and historical.
- [ ] `GET /admin/reports/settlements` and failed settlement attempts.
- [ ] CSV export with authorization, bounded date range and job-based generation for large exports.
- [ ] Admin audit-log search and export.
- [ ] Operational alerts dashboard: failed polls, failed jobs, quota threshold, settlement failures.

## Phase 10: Audit, Security and Reliability

- [ ] Add `AdminAuditLog` model if it does not yet exist.
- [ ] Log actor, action, resource type/id, before/after data, reason, request ID and IP.
- [ ] Add request IDs and structured logs to every admin mutation.
- [ ] Rate-limit login and destructive/admin mutation endpoints.
- [ ] Validate all amounts with decimal-safe arithmetic.
- [ ] Enforce idempotency on credit/debit/settlement/void actions.
- [ ] Use database transactions for all multi-table state changes.
- [ ] Add optimistic concurrency/version checks for mutable configuration where needed.
- [ ] Restrict secrets and provider keys to server-side environment variables.
- [ ] Add backup/restore procedure for the shared PostgreSQL database.

## Phase 11: Tests and Delivery

- [ ] Unit tests for permission guards, finance validation and exposure calculations.
- [ ] Integration tests for every admin mutation endpoint.
- [ ] Settlement test matrix: win, loss, void, cancel, duplicate request and rollback.
- [ ] Authorization tests: non-admin roles must receive `403`.
- [ ] API contract tests for response envelopes and validation errors.
- [ ] Seed deterministic admin/user/event/bet fixtures.
- [ ] Docker service definition for `admin-server`.
- [ ] CI: typecheck, tests and migration validation.
- [ ] Production runbook: migrations, health checks, logs and rollback procedure.

## Suggested Delivery Order

1. Foundation and admin authentication.
2. User list/detail and read-only bets/exposure views.
3. Sports/event/market operational controls through odds-server integration.
4. Wallet ledger and manual balance adjustment.
5. Risk limits and exposure monitoring.
6. Results and transaction-safe settlement.
7. Reports, audit search and operational alerts.