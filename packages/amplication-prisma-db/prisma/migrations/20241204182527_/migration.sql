/*
  Warnings:

  - A unique constraint covering the columns `[provider,installationId,workspaceId]` on the table `GitOrganization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GitOrganization_provider_installationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "GitOrganization_provider_installationId_workspaceId_key" ON "GitOrganization"("provider", "installationId", "workspaceId");
