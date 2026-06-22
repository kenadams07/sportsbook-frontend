CREATE TABLE "SportCategory" (
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SportCategory_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "SportCategory_name_key" ON "SportCategory"("name");

ALTER TABLE "Sport" ADD COLUMN "categoryKey" TEXT;

INSERT INTO "SportCategory" ("key", "name", "active", "createdAt", "updatedAt")
SELECT
  lower(regexp_replace(regexp_replace(trim("group"), '[^a-zA-Z0-9]+', '_', 'g'), '^_|_$', '', 'g')) AS "key",
  trim("group") AS "name",
  true AS "active",
  CURRENT_TIMESTAMP AS "createdAt",
  CURRENT_TIMESTAMP AS "updatedAt"
FROM "Sport"
WHERE trim("group") <> ''
GROUP BY trim("group")
ON CONFLICT ("name") DO UPDATE SET
  "active" = EXCLUDED."active",
  "updatedAt" = CURRENT_TIMESTAMP;

UPDATE "Sport"
SET "categoryKey" = lower(regexp_replace(regexp_replace(trim("group"), '[^a-zA-Z0-9]+', '_', 'g'), '^_|_$', '', 'g'))
WHERE trim("group") <> '';

CREATE INDEX "Sport_categoryKey_idx" ON "Sport"("categoryKey");
CREATE INDEX "Sport_group_idx" ON "Sport"("group");

ALTER TABLE "Sport"
ADD CONSTRAINT "Sport_categoryKey_fkey"
FOREIGN KEY ("categoryKey") REFERENCES "SportCategory"("key")
ON DELETE SET NULL ON UPDATE CASCADE;
