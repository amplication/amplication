/*
  Warnings:

  - The values [Auth0Signup] on the enum `PreviewAccountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
UPDATE "Account"
SET "previewAccountType" = 'None'
WHERE "previewAccountType" = 'Auth0Signup';
CREATE TYPE "PreviewAccountType_new" AS ENUM ('None', 'BreakingTheMonolith');
ALTER TABLE "Account" ALTER COLUMN "previewAccountType" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "previewAccountType" TYPE "PreviewAccountType_new" USING ("previewAccountType"::text::"PreviewAccountType_new");
ALTER TYPE "PreviewAccountType" RENAME TO "PreviewAccountType_old";
ALTER TYPE "PreviewAccountType_new" RENAME TO "PreviewAccountType";
DROP TYPE "PreviewAccountType_old";
ALTER TABLE "Account" ALTER COLUMN "previewAccountType" SET DEFAULT 'None';
COMMIT;
