/*
  Warnings:

  - You are about to drop the `GitRepositoryPull` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumGitPullEventStatus" AS ENUM ('Created', 'Ready', 'Deleted');

-- DropTable
DROP TABLE "GitRepositoryPull";

-- DropEnum
DROP TYPE "EnumGitRepositoryPullStatus";

-- CreateTable
CREATE TABLE "GitPullEvent" (
    "id" BIGSERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "repositoryOwner" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "commit" TEXT NOT NULL,
    "status" "EnumGitPullEventStatus" NOT NULL,
    "pushedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GitPullEvent_pkey" PRIMARY KEY ("id")
);
