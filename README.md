# Sportbooks Backend V2

Backend workspace for the sportsbook platform.

## Structure

```text
apps/
  odds-server/
  user-server/
  admin-server/

packages/
  db/
  shared-types/
  config/
  logger/

docs/
docker/
```

## Ownership

- `apps/odds-server` owns live odds ingestion, event registration, odds snapshots, and odds streaming.
- `apps/user-server` owns users, wallets, bets, transactions, exposure, and settlement workflows.
- `apps/admin-server` owns admin-facing APIs, operational controls, settings, audit views, and reports.
- `packages/db` will become the single Prisma schema and migration owner for the shared PostgreSQL database.
- Prisma schema and migrations now live in `packages/db/prisma`.

## Backend Framework

All backend apps should use Fastify.

We are not using NestJS in this v2 workspace. The goal is to keep all three services aligned with the existing odds-server style:

- Fastify server setup
- service/repository layering
- Prisma for database access
- shared packages for database, config, logger, and common types

## Migration Rule

Only `packages/db` should own Prisma migrations.

Do not keep independent Prisma or TypeORM migration histories inside each app when all apps use the same database.

## Roadmaps

- User-server migration roadmap: `docs/USER_SERVER_ROADMAP.md`
- Workspace migration plan: `docs/MIGRATION_PLAN.md`
- Architecture notes: `docs/ARCHITECTURE.md`

## Pending Infrastructure

- Add Dockerfiles for `odds-server`, `user-server`, and `admin-server`.
- Add workspace-level Docker Compose for Timescale/Postgres, Redis, and all three Fastify apps.
