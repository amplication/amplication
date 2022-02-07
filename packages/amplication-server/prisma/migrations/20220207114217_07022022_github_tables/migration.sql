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
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitRepository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gitOrganizationId" TEXT,

    CONSTRAINT "GitRepository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToGitOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToGitOrganization_AB_unique" ON "_AccountToGitOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToGitOrganization_B_index" ON "_AccountToGitOrganization"("B");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_gitRepositoryId_fkey" FOREIGN KEY ("gitRepositoryId") REFERENCES "GitRepository"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_gitOrganizationId_fkey" FOREIGN KEY ("gitOrganizationId") REFERENCES "GitOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToGitOrganization" ADD FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToGitOrganization" ADD FOREIGN KEY ("B") REFERENCES "GitOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
