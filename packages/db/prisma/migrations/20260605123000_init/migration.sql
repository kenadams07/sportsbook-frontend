-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PRE_MATCH', 'LIVE', 'SETTLED');

-- CreateTable
CREATE TABLE "Sport" (
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "hasOutrights" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SportConfig" (
    "id" SERIAL NOT NULL,
    "sportKey" TEXT NOT NULL,
    "regions" TEXT[],
    "markets" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "sportKey" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "commenceTime" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PRE_MATCH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OddsSnapshot" (
    "id" BIGSERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "bookmaker" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "price" DECIMAL(10,4) NOT NULL,
    "prevPrice" DECIMAL(10,4),
    "point" DECIMAL(6,2),
    "impliedProb" DECIMAL(6,4) NOT NULL,
    "overround" DECIMAL(6,4) NOT NULL,
    "moved" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OddsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SportConfig_sportKey_key" ON "SportConfig"("sportKey");

-- CreateIndex
CREATE INDEX "Event_sportKey_idx" ON "Event"("sportKey");

-- CreateIndex
CREATE INDEX "Event_commenceTime_idx" ON "Event"("commenceTime");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "OddsSnapshot_eventId_capturedAt_idx" ON "OddsSnapshot"("eventId", "capturedAt");

-- CreateIndex
CREATE INDEX "OddsSnapshot_capturedAt_idx" ON "OddsSnapshot"("capturedAt");

-- CreateIndex
CREATE INDEX "OddsSnapshot_bookmaker_market_idx" ON "OddsSnapshot"("bookmaker", "market");

-- AddForeignKey
ALTER TABLE "SportConfig" ADD CONSTRAINT "SportConfig_sportKey_fkey" FOREIGN KEY ("sportKey") REFERENCES "Sport"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sportKey_fkey" FOREIGN KEY ("sportKey") REFERENCES "Sport"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OddsSnapshot" ADD CONSTRAINT "OddsSnapshot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
