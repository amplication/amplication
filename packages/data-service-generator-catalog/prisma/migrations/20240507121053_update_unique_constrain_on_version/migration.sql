/*
  Warnings:

  - A unique constraint covering the columns `[name,generatorId]` on the table `Version` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Version_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Version_name_generatorId_key" ON "Version"("name", "generatorId");
