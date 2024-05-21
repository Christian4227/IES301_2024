/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `VENUES` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `VENUES` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VENUES" ADD COLUMN     "name" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VENUES_name_key" ON "VENUES"("name");
