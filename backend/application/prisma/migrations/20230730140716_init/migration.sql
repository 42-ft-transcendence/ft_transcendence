-- CreateEnum
CREATE TYPE "ladder_enum" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "channel_type_enum" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'ONETOONE');

-- CreateEnum
CREATE TYPE "map_type_enum" AS ENUM ('NORMAL', 'INVERSE', 'VERTICAL', 'FAST');

-- CreateEnum
CREATE TYPE "match_type_enum" AS ENUM ('NORMAL', 'RANK');

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT NOT NULL,
    "nickname" VARCHAR(10) NOT NULL,
    "win_count" INTEGER NOT NULL DEFAULT 0,
    "lose_count" INTEGER NOT NULL DEFAULT 0,
    "ladder" "ladder_enum" NOT NULL DEFAULT 'BRONZE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrator" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ban" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block" (
    "id" SERIAL NOT NULL,
    "blocker_id" INTEGER NOT NULL,
    "blockee_id" INTEGER NOT NULL,

    CONSTRAINT "block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "channel_type_enum" NOT NULL DEFAULT 'PUBLIC',
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_password" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "channel_id" INTEGER NOT NULL,

    CONSTRAINT "channel_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "followee_id" INTEGER NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "type" "match_type_enum" NOT NULL,
    "mapType" "map_type_enum" NOT NULL,
    "match_at" TIMESTAMP(3) NOT NULL,
    "winner_id" INTEGER,
    "loser_id" INTEGER,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel_id" INTEGER NOT NULL,
    "sender_id" INTEGER,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_avatar_key" ON "account"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "account_nickname_key" ON "account"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_key" ON "channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "channel_password_channel_id_key" ON "channel_password"("channel_id");

-- AddForeignKey
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ban" ADD CONSTRAINT "ban_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ban" ADD CONSTRAINT "ban_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "block" ADD CONSTRAINT "block_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "block" ADD CONSTRAINT "block_blockee_id_fkey" FOREIGN KEY ("blockee_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_password" ADD CONSTRAINT "channel_password_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
