# Architecture

This workspace is moving toward three backend apps with one Prisma-managed PostgreSQL database.

```text
frontend/admin UI
  -> admin-server

frontend/user UI
  -> user-server

odds provider
  -> odds-server
```

All three backend apps use Fastify. NestJS is intentionally not part of this v2 backend structure.

The services share a database schema, but table writes must still have clear ownership.

## Service Ownership

```text
odds-server
  writes: Sport, Event, Market, Runner, OddsSnapshot, SportConfig
  reads: service-owned config and odds state

user-server
  writes: User, Wallet, Bet, Transaction, Exposure
  reads: Sport, Event, Market, Runner for bet validation/context

admin-server
  writes: AdminUser, Settings, AuditLog and admin-owned controls
  reads: users, bets, events, odds status for reports and operations
```

## Important Rule

Same database does not mean every app can freely mutate every table.

The shared schema gives referential integrity. Service ownership keeps behavior predictable.

## Migration Roadmaps

- User-server route and module rebuild: `USER_SERVER_ROADMAP.md`
- Workspace migration plan: `MIGRATION_PLAN.md`
