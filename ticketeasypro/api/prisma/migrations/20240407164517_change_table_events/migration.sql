/*
  Warnings:

  - Added the required column `base_price` to the `EVENTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `EVENTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_banner` to the `EVENTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_thumbnail` to the `EVENTS` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EVENTS_name_key";

-- AlterTable
ALTER TABLE "EVENTS" ADD COLUMN     "base_price" BIGINT NOT NULL,
ADD COLUMN     "capacity" BIGINT NOT NULL,
ADD COLUMN     "img_banner" VARCHAR NOT NULL,
ADD COLUMN     "img_thumbnail" VARCHAR NOT NULL;
