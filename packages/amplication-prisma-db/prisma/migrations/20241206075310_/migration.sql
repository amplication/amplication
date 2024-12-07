/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,blueprintId,key]` on the table `CustomProperty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,blueprintId,name]` on the table `CustomProperty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomProperty.workspaceId_key_unique";

-- DropIndex
DROP INDEX "CustomProperty.workspaceId_name_unique";

-- CreateIndex
CREATE UNIQUE INDEX "CustomProperty.workspaceId_blueprintId_key_unique" ON "CustomProperty"("workspaceId", "blueprintId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "CustomProperty.workspaceId_blueprintId_name_unique" ON "CustomProperty"("workspaceId", "blueprintId", "name");
