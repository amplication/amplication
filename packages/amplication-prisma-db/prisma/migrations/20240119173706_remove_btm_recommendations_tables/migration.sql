/*
  Warnings:

  - You are about to drop the `BtmEntityRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BtmResourceRecommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BtmEntityRecommendation" DROP CONSTRAINT "BtmEntityRecommendation_btmResourceRecommendationId_fkey";

-- DropForeignKey
ALTER TABLE "BtmEntityRecommendation" DROP CONSTRAINT "BtmEntityRecommendation_originalEntityId_fkey";

-- DropForeignKey
ALTER TABLE "BtmResourceRecommendation" DROP CONSTRAINT "BtmResourceRecommendation_resourceId_fkey";

-- DropTable
DROP TABLE "BtmEntityRecommendation";

-- DropTable
DROP TABLE "BtmResourceRecommendation";
