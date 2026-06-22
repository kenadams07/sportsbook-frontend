# Migration Plan

## Goal

Move from legacy TypeORM services and an isolated odds-server database to a clean Prisma-based backend workspace.

## Target

```text
one PostgreSQL database
one Prisma schema
one migrations folder
three backend apps
Fastify across all backend apps
```

## Steps

1. Keep the current odds-server running as the reference implementation.
2. Create `packages/db` as the Prisma schema owner.
3. Move the odds-server Prisma schema into `packages/db`. Done.
4. Add user/admin models to the shared Prisma schema.
5. Build `user-server` with Fastify against the shared Prisma client.
6. Build `admin-server` with Fastify against the shared Prisma client.
7. Retire legacy TypeORM services module by module.
8. Remove old match-odds-service dependencies after betting flow is verified.

## Deployment Rule

Run migrations once before deploying app versions that depend on the new schema.
