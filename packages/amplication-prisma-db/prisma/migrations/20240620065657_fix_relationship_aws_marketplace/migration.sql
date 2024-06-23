/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId]` on the table `AwsMarketplaceIntegration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerIdentifier,productCode]` on the table `AwsMarketplaceIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AwsMarketplaceIntegration" DROP CONSTRAINT "AwsMarketplaceIntegration_workspaceId_fkey";

-- DropIndex
DROP INDEX "AwsMarketplaceIntegration_customerIdentifier_key";

-- CreateIndex
CREATE UNIQUE INDEX "AwsMarketplaceIntegration_workspaceId_key" ON "AwsMarketplaceIntegration"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "AwsMarketplaceIntegration.customerIdentifier_productCode_unique" ON "AwsMarketplaceIntegration"("customerIdentifier", "productCode");

-- AddForeignKey
ALTER TABLE "AwsMarketplaceIntegration" ADD CONSTRAINT "AwsMarketplaceIntegration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
