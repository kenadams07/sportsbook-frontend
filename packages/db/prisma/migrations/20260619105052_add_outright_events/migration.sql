-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MATCH', 'OUTRIGHT');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'MATCH',
ALTER COLUMN "homeTeam" DROP NOT NULL,
ALTER COLUMN "awayTeam" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SportCategory" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");
