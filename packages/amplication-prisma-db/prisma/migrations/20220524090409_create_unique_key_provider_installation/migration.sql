/*
  Warnings:

  - A unique constraint covering the columns `[provider,installationId]` on the table `GitOrganization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GitOrganization_provider_installationId_key" ON "GitOrganization"("provider", "installationId");
