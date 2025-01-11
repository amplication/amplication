/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,key]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role.workspaceId_key_unique" ON "Role"("workspaceId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Role.workspaceId_name_unique" ON "Role"("workspaceId", "name");
