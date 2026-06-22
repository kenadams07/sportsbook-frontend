-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('ODDS');

-- CreateEnum
CREATE TYPE "MarketExposureStatus" AS ENUM ('ONE', 'TWO', 'THREE');

-- CreateEnum
CREATE TYPE "OutcomeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BettingType" AS ENUM ('ODDS');

-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('BACK');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'CANCELLED', 'VOID', 'SETTLED', 'OTHER');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('ONE', 'TWO', 'THREE');

-- CreateTable
CREATE TABLE "Market" (
  "id" TEXT NOT NULL,
  "marketId" TEXT NOT NULL,
  "eventId" TEXT,
  "marketName" TEXT NOT NULL,
  "marketType" "MarketType" NOT NULL DEFAULT 'ODDS',
  "marketTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" "MarketExposureStatus" NOT NULL DEFAULT 'ONE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
  "id" TEXT NOT NULL,
  "selectionId" TEXT NOT NULL,
  "marketId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "OutcomeStatus" NOT NULL DEFAULT 'ACTIVE',
  "actualStatus" "OutcomeStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "sportKey" TEXT NOT NULL,
  "sportTitle" TEXT,
  "marketDbId" TEXT,
  "marketId" TEXT NOT NULL,
  "marketName" TEXT NOT NULL,
  "marketType" TEXT NOT NULL,
  "outcomeDbId" TEXT,
  "selectionId" TEXT NOT NULL,
  "selection" TEXT NOT NULL,
  "selectionType" "SelectionType" NOT NULL DEFAULT 'BACK',
  "bettingType" "BettingType" NOT NULL DEFAULT 'ODDS',
  "odds" DECIMAL(10,2) NOT NULL,
  "stake" DECIMAL(15,2) NOT NULL,
  "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
  "leagueId" TEXT,
  "homeTeam" TEXT,
  "awayTeam" TEXT,
  "commenceTime" TIMESTAMP(3),
  "eventStatusAtPlacement" "EventStatus",
  "potentialPayout" DECIMAL(15,2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exposure" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "marketDbId" TEXT,
  "marketId" TEXT NOT NULL,
  "marketType" TEXT NOT NULL,
  "exposure" DECIMAL(15,2) NOT NULL,
  "isClear" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Exposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultTransaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "marketDbId" TEXT,
  "marketId" TEXT,
  "eventId" TEXT,
  "description" TEXT NOT NULL,
  "pl" DECIMAL(15,2) NOT NULL,
  "type" TEXT NOT NULL,
  "commissionStatus" "CommissionStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ResultTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_marketId_eventId_key" ON "Market"("marketId", "eventId");

-- CreateIndex
CREATE INDEX "Market_eventId_idx" ON "Market"("eventId");

-- CreateIndex
CREATE INDEX "Market_marketId_idx" ON "Market"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_marketId_selectionId_key" ON "Outcome"("marketId", "selectionId");

-- CreateIndex
CREATE INDEX "Outcome_selectionId_idx" ON "Outcome"("selectionId");

-- CreateIndex
CREATE INDEX "Bet_userId_idx" ON "Bet"("userId");

-- CreateIndex
CREATE INDEX "Bet_eventId_idx" ON "Bet"("eventId");

-- CreateIndex
CREATE INDEX "Bet_marketId_idx" ON "Bet"("marketId");

-- CreateIndex
CREATE INDEX "Bet_sportKey_idx" ON "Bet"("sportKey");

-- CreateIndex
CREATE INDEX "Bet_status_idx" ON "Bet"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Exposure_userId_eventId_marketId_key" ON "Exposure"("userId", "eventId", "marketId");

-- CreateIndex
CREATE INDEX "Exposure_userId_idx" ON "Exposure"("userId");

-- CreateIndex
CREATE INDEX "Exposure_eventId_idx" ON "Exposure"("eventId");

-- CreateIndex
CREATE INDEX "Exposure_marketId_idx" ON "Exposure"("marketId");

-- CreateIndex
CREATE INDEX "Exposure_isClear_idx" ON "Exposure"("isClear");

-- CreateIndex
CREATE INDEX "ResultTransaction_userId_idx" ON "ResultTransaction"("userId");

-- CreateIndex
CREATE INDEX "ResultTransaction_marketId_idx" ON "ResultTransaction"("marketId");

-- CreateIndex
CREATE INDEX "ResultTransaction_eventId_idx" ON "ResultTransaction"("eventId");

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_marketDbId_fkey" FOREIGN KEY ("marketDbId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_outcomeDbId_fkey" FOREIGN KEY ("outcomeDbId") REFERENCES "Outcome"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exposure" ADD CONSTRAINT "Exposure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exposure" ADD CONSTRAINT "Exposure_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exposure" ADD CONSTRAINT "Exposure_marketDbId_fkey" FOREIGN KEY ("marketDbId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultTransaction" ADD CONSTRAINT "ResultTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultTransaction" ADD CONSTRAINT "ResultTransaction_marketDbId_fkey" FOREIGN KEY ("marketDbId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;
