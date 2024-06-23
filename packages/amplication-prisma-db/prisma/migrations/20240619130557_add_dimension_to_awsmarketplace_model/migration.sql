/*
  Warnings:

  - Added the required column `dimension` to the `AwsMarketplaceIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AwsMarketplaceIntegration" ADD COLUMN     "dimension" TEXT NOT NULL;
