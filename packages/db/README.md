# @sportbooks/db

Shared Prisma database package.

This package is the only owner of:

- `prisma/schema.prisma`
- `prisma/migrations`
- generated Prisma Client exports

Current usage:

- Run `npm run db:generate` from the workspace root after schema changes.
- Run `npm run db:migrate` from the workspace root for development migrations.
- Run `npm run db:deploy` from the workspace root for production migration deploys.
- Import `prisma`, `connectDb`, and `disconnectDb` from `@sportbooks/db`.
