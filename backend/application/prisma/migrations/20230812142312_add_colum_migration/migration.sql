/*
  Warnings:

  - A unique constraint covering the columns `[fourty_two_id]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fourty_two_id` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "fourty_two_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "account_fourty_two_id_key" ON "account"("fourty_two_id");
