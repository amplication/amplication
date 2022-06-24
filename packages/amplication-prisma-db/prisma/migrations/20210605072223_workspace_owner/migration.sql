-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;

--Make all existing users owners of their workspace. The DB default is false
UPDATE "User" SET "isOwner" = true