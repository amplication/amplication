-- CreateEnum
CREATE TYPE "PreviewAccountType" AS ENUM ('None', 'BreakingTheMonolith');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "previewAccountType" "PreviewAccountType" NOT NULL DEFAULT 'None';
