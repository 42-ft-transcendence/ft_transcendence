-- This is an empty migration.

ALTER TABLE "follow"
ADD CONSTRAINT "follower_id_followee_id_check"
CHECK ("follower_id" <> "followee_id");

ALTER TABLE "block"
ADD CONSTRAINT "blocker_id_blockee_id_check"
CHECK ("blocker_id" <> "blockee_id");

ALTER TABLE "match"
ADD CONSTRAINT "winner_id_loser_id_check"
CHECK ("winner_id" <> "loser_id");