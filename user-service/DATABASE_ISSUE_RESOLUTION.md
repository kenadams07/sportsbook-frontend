# Database Schema Issue Resolution

## Problem Description

When attempting to login via the API endpoint `http://localhost:3001/users/login`, the application was returning the following error:

```
{"code":500,"message":"column Users.currency_id does not exist","errors":null}
```

## Root Cause

The issue was caused by a mismatch between the TypeORM entity definition and the actual database schema:

1. The [Users entity](file:///c:/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/src/users/users.entity.ts#L8-L115) defined a relationship with the [Currency](file:///c:/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/src/currency/currency.entity.ts#L6-L20) entity using a `currency_id` column
2. The database table was missing this column, causing TypeORM to fail when querying the Users table

## Solution Applied

We resolved the issue by adding the missing `currency_id` column to the users table with the proper foreign key constraint:

```sql
ALTER TABLE "users" ADD COLUMN "currency_id" uuid;
CREATE INDEX "IDX_9b53d0bfa309b8b2c1389d0a1f" ON "users" ("currency_id");
ALTER TABLE "users" ADD CONSTRAINT "FK_9b53d0bfa309b8b2c1389d0a1f" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
```

## Why This Happened

This issue typically occurs when:

1. Database migrations are not run properly after entity changes
2. The database schema gets out of sync with the TypeORM entity definitions
3. Manual database changes are made without updating the corresponding migrations

## Prevention Measures

To prevent this issue from happening again, follow these practices:

### 1. Always Run Migrations
After making entity changes, ensure migrations are created and executed:

```bash
# Create a new migration
npx typeorm migration:create src/migrations/DescriptionOfChange

# Run pending migrations
npx typeorm migration:run -d ormconfig.ts
```

### 2. Use the Schema Verification Script
Run the provided verification script regularly to check for schema issues:

```bash
node fix-database-schema.js
```

### 3. Enable Synchronization (Development Only)
During development, you can temporarily enable TypeORM synchronization in [ormconfig.ts](file:///c:/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/ormconfig.ts):

```typescript
export const AppDataSource = new DataSource({
  // ... other config
  synchronize: true, // Only for development!
  logging: false,
});
```

**Warning**: Never enable `synchronize: true` in production as it can cause data loss.

### 4. Regular Database Schema Checks
Add schema validation to your deployment pipeline to catch these issues before they reach production.

## Files Modified/Fixed

1. Added migration: `src/migrations/1760183500600-FixCurrencyIdColumn.ts`
2. Created verification script: `fix-database-schema.js`
3. Verified database schema is now in sync with TypeORM entities

## Verification

After applying the fix:
1. The database now contains the `currency_id` column in the users table
2. The foreign key constraint is properly set up
3. The login API endpoint works correctly
4. User currency information can be retrieved through the relationship

The issue has been permanently resolved and the system should now function correctly.