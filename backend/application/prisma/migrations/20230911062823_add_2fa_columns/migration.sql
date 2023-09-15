-- AlterTable
ALTER TABLE "account" ADD COLUMN     "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp_secret" TEXT;
