/*
  Warnings:

  - You are about to drop the column `type_id` on the `ORDERTICKETS` table. All the data in the column will be lost.
  - Added the required column `ticket_id` to the `ORDERTICKETS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ORDERTICKETS" DROP CONSTRAINT "ORDERTICKETS_type_id_fkey";

-- AlterTable
ALTER TABLE "ORDERTICKETS" DROP COLUMN "type_id",
ADD COLUMN     "ticketTypeId" INTEGER,
ADD COLUMN     "ticket_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TICKETTYPES"("id") ON DELETE SET NULL ON UPDATE CASCADE;
