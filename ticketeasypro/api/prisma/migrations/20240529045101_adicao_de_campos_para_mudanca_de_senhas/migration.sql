/*
  Warnings:

  - A unique constraint covering the columns `[reset_password_token]` on the table `USERS` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "USERS" ADD COLUMN     "reset_password_expires" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "USERS_reset_password_token_key" ON "USERS"("reset_password_token");
