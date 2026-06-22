-- Existing signup-era users were created with the old default role 0.
-- User panel accounts must use role 7; admin/master roles remain unchanged.
UPDATE "User"
SET "role" = 7
WHERE "role" = 0;

ALTER TABLE "User"
ALTER COLUMN "role" SET DEFAULT 7;
