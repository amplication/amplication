/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "App" ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_workspaceId_name_key" ON "Project"("workspaceId", "name");
