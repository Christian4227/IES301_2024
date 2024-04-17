/*
  Warnings:

  - The values [CANCELED] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymenMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'USED', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "EVENTS" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "EVENTS" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "EVENTS" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
COMMIT;
