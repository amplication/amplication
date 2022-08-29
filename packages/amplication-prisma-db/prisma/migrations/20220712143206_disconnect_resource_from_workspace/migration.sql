/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Resource` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,name]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `projectId` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_workspaceId_fkey";

-- DropIndex
DROP INDEX "Resource.workspaceId_name_unique";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3)  NULL;
UPDATE "Project" SET "updatedAt" = NOW();
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET NOT NULL;


-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "workspaceId",
ALTER COLUMN "projectId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resource.projectId_name_unique" ON "Resource"("projectId", "name");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
