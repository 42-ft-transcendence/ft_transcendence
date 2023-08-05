/*
  Warnings:

  - A unique constraint covering the columns `[channel_id,account_id]` on the table `administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channel_id,account_id]` on the table `ban` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blocker_id,blockee_id]` on the table `block` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channel_id,account_id]` on the table `participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "administrator_channel_id_account_id_key" ON "administrator"("channel_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "ban_channel_id_account_id_key" ON "ban"("channel_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "block_blocker_id_blockee_id_key" ON "block"("blocker_id", "blockee_id");

-- CreateIndex
CREATE UNIQUE INDEX "participant_channel_id_account_id_key" ON "participant"("channel_id", "account_id");
