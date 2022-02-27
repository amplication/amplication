-- DropForeignKey
ALTER TABLE "GitOrganization" DROP CONSTRAINT "GitOrganization_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_appId_fkey";

-- DropForeignKey
ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_gitOrganizationId_fkey";

-- AlterTable
ALTER TABLE "GitOrganization" ALTER COLUMN "installationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "GitOrganization" ADD CONSTRAINT "GitOrganization_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_gitOrganizationId_fkey" FOREIGN KEY ("gitOrganizationId") REFERENCES "GitOrganization"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
