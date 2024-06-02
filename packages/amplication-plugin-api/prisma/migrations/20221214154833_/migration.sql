/*
  Warnings:

  - A unique constraint covering the columns `[pluginIdVersion]` on the table `PluginVersion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pluginIdVersion` to the `PluginVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PluginVersion" ADD COLUMN     "pluginIdVersion" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PluginVersion_pluginIdVersion_key" ON "PluginVersion"("pluginIdVersion");
