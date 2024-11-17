/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,key]` on the table `Blueprint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `Blueprint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `Blueprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blueprint" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint.workspaceId_key_unique" ON "Blueprint"("workspaceId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint.workspaceId_name_unique" ON "Blueprint"("workspaceId", "name");

-- AddForeignKey
ALTER TABLE "Blueprint" ADD CONSTRAINT "Blueprint_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
