/*
  Warnings:

  - You are about to drop the column `codeGeneratorName` on the `Plugin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plugin" ALTER COLUMN "codeGeneratorName" SET NULL;
UPDATE "Plugin" SET "codeGeneratorName" = NULL

ALTER TABLE "Plugin" DROP COLUMN "codeGeneratorName",
ADD COLUMN     "codeGeneratorNames" JSONB DEFAULT '["data-service-generator"]';
