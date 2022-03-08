/*
  Warnings:

  - You are about to drop the column `githubBranch` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubRepo` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubSyncEnabled` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubToken` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubTokenCreatedDate` on the `App` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumGitProvider" AS ENUM ('Github');

-- AlterTable
ALTER TABLE "App" DROP COLUMN "githubBranch",
DROP COLUMN "githubRepo",
DROP COLUMN "githubSyncEnabled",
DROP COLUMN "githubToken",
DROP COLUMN "githubTokenCreatedDate";

-- CreateTable
CREATE TABLE "GitOrganization" (
    "id" TEXT NOT NULL,
    "provider" "EnumGitProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "GitOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitRepository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gitOrganizationId" TEXT NOT NULL,

    CONSTRAINT "GitRepository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitRepository_appId_key" ON "GitRepository"("appId");

-- AddForeignKey
ALTER TABLE "GitOrganization" ADD CONSTRAINT "GitOrganization_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_gitOrganizationId_fkey" FOREIGN KEY ("gitOrganizationId") REFERENCES "GitOrganization"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
