/*
  Warnings:

  - You are about to drop the column `codeGeneratorNames` on the `Plugin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plugin" DROP COLUMN "codeGeneratorNames",
ADD COLUMN     "codeGeneratorName" TEXT NOT NULL DEFAULT 'NodeJs';
