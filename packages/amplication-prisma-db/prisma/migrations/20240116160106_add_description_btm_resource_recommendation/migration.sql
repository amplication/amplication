/*
  Warnings:

  - Added the required column `description` to the `BtmResourceRecommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BtmResourceRecommendation" ADD COLUMN     "description" TEXT NOT NULL;
