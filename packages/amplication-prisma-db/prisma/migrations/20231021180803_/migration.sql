/*
  Warnings:

  - A unique constraint covering the columns `[resourceId,displayName,blockType,parentBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Block.resourceId_displayName_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Block.resourceId_displayName_unique" ON "Block"("resourceId", "displayName", "blockType", "parentBlockId");
