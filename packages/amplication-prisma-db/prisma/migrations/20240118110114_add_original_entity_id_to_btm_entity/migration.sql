/*
  Warnings:

  - A unique constraint covering the columns `[originalEntityId]` on the table `BtmEntityRecommendation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalEntityId` to the `BtmEntityRecommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BtmEntityRecommendation" ADD COLUMN     "originalEntityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BtmEntityRecommendation_originalEntityId_key" ON "BtmEntityRecommendation"("originalEntityId");

-- AddForeignKey
ALTER TABLE "BtmEntityRecommendation" ADD CONSTRAINT "BtmEntityRecommendation_originalEntityId_fkey" FOREIGN KEY ("originalEntityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
