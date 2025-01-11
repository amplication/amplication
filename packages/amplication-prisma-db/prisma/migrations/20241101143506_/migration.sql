/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,key]` on the table `CustomProperty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `CustomProperty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomProperty.workspaceId_key_unique" ON "CustomProperty"("workspaceId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "CustomProperty.workspaceId_name_unique" ON "CustomProperty"("workspaceId", "name");
