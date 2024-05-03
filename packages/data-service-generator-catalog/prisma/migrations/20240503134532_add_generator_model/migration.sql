/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Version` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Version` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "generatorId" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Generator" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT,
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "name" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Generator_fullName_key" ON "Generator"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Generator_name_key" ON "Generator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Version_name_key" ON "Version"("name");

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "Generator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
