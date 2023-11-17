/*
  Warnings:

  - You are about to drop the column `resourceId` on the `Commit` table. All the data in the column will be lost.
  - Made the column `projectId` on table `Commit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_resourceId_fkey";

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "resourceId",
ALTER COLUMN "projectId" SET NOT NULL;
