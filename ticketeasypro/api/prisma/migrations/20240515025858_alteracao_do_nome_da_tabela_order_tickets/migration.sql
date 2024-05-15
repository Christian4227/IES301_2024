/*
  Warnings:

  - You are about to drop the column `type_id` on the `TICKETS` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `ORDERTICKETS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TICKETS" DROP CONSTRAINT "TICKETS_type_id_fkey";

-- AlterTable
ALTER TABLE "ORDERTICKETS" ADD COLUMN     "type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TICKETS" DROP COLUMN "type_id";

-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "TYPETICKETS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
