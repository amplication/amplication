/*
  Warnings:

  - A unique constraint covering the columns `[buildId,packageName]` on the table `BuildPlugin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BuildPlugin.buildId_packageName_unique" ON "BuildPlugin"("buildId", "packageName");
