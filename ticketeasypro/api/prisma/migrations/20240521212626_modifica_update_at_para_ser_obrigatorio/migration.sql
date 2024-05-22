/*
  Warnings:

  - Made the column `updated_at` on table `CATEGORIES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `EVENTS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `ORDERS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `ORDERTICKETS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `TICKETS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `TYPETICKETS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `USERS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `VENUES` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CATEGORIES" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "EVENTS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "ORDERS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "ORDERTICKETS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "TICKETS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "TYPETICKETS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "USERS" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "VENUES" ALTER COLUMN "updated_at" SET NOT NULL;
