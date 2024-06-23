-- CreateTable
CREATE TABLE "AwsMarketplaceIntegration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "customerIdentifier" TEXT NOT NULL,
    "awsAccountId" TEXT NOT NULL,
    "accountId" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "AwsMarketplaceIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AwsMarketplaceIntegration_email_key" ON "AwsMarketplaceIntegration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AwsMarketplaceIntegration_customerIdentifier_key" ON "AwsMarketplaceIntegration"("customerIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "AwsMarketplaceIntegration_accountId_key" ON "AwsMarketplaceIntegration"("accountId");

-- AddForeignKey
ALTER TABLE "AwsMarketplaceIntegration" ADD CONSTRAINT "AwsMarketplaceIntegration_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AwsMarketplaceIntegration" ADD CONSTRAINT "AwsMarketplaceIntegration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
