-- CreateEnum
CREATE TYPE "EnumGitPullEventStatus" AS ENUM ('Created', 'Ready', 'Deleted');

-- CreateEnum
CREATE TYPE "GitProviderEnum" AS ENUM ('Github');

-- CreateTable
CREATE TABLE "GitPullEvent" (
    "id" BIGSERIAL NOT NULL,
    "provider" "GitProviderEnum" NOT NULL,
    "repositoryOwner" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "commit" TEXT NOT NULL,
    "status" "EnumGitPullEventStatus" NOT NULL,
    "pushedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GitPullEvent_id_key" ON "GitPullEvent"("id");

-- CreateIndex
CREATE INDEX "idx_pushedAt" ON "GitPullEvent"("pushedAt");

-- CreateIndex
CREATE INDEX "idx_provider_repositoryOwner_repositoryName" ON "GitPullEvent"("provider", "repositoryOwner", "repositoryName");
