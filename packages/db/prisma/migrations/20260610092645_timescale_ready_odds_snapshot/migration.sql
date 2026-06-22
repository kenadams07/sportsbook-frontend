/*
  Timescale-ready OddsSnapshot change.

  - Adds sportKey safely by backfilling from Event.
  - Changes primary key to include capturedAt, which is required for Timescale hypertables.
*/

ALTER TABLE "OddsSnapshot"
ADD COLUMN "sportKey" TEXT;

UPDATE "OddsSnapshot" os
SET "sportKey" = e."sportKey"
FROM "Event" e
WHERE os."eventId" = e."id";

ALTER TABLE "OddsSnapshot"
ALTER COLUMN "sportKey" SET NOT NULL;

ALTER TABLE "OddsSnapshot"
DROP CONSTRAINT "OddsSnapshot_pkey",
ADD CONSTRAINT "OddsSnapshot_pkey" PRIMARY KEY ("id", "capturedAt");

CREATE INDEX "OddsSnapshot_sportKey_capturedAt_idx"
ON "OddsSnapshot"("sportKey", "capturedAt");