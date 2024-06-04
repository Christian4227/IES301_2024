/*
  Warnings:

  - You are about to drop the column `reset_password_expires` on the `USERS` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `USERS` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `USERS` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "USERS_reset_password_token_key";

-- AlterTable
ALTER TABLE "USERS" DROP COLUMN "reset_password_expires",
DROP COLUMN "reset_password_token",
ADD COLUMN     "token" TEXT,
ADD COLUMN     "token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_token_key" ON "USERS"("token");
