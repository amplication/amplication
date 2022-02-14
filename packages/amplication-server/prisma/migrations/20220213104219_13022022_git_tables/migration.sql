-- CreateEnum
CREATE TYPE "EnumProvider" AS ENUM ('gitHub');

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "gitRepositoryId" TEXT;

-- CreateTable
CREATE TABLE "GitOrganization" (
    "id" TEXT NOT NULL,
    "provider" "EnumProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "installationId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "GitOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitRepository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gitOrganizationId" TEXT,

    CONSTRAINT "GitRepository_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GitOrganization" ADD CONSTRAINT "GitOrganization_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_gitOrganizationId_fkey" FOREIGN KEY ("gitOrganizationId") REFERENCES "GitOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_gitRepositoryId_fkey" FOREIGN KEY ("gitRepositoryId") REFERENCES "GitRepository"("id") ON DELETE SET NULL ON UPDATE CASCADE;
