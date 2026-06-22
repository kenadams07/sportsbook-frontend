-- CreateEnum
CREATE TYPE "EventStatusSource" AS ENUM ('SYSTEM', 'SCORES_API', 'ADMIN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'POSTPONED';
ALTER TYPE "EventStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "statusSource" "EventStatusSource" NOT NULL DEFAULT 'SYSTEM';
