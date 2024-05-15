/*
  Warnings:

  - You are about to drop the `ORDERITEMS` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'CANCELLED';

-- DropTable
DROP TABLE "ORDERITEMS";

-- CreateTable
CREATE TABLE "ORDERTICKETS" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "ORDERTICKETS_pkey" PRIMARY KEY ("id")
);
