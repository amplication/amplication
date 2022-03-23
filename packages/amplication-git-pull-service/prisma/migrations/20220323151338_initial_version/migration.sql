/*
  Warnings:

  - You are about to drop the `GitHubRepository` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumGitRepositoryPullStatus" AS ENUM ('Created', 'Ready', 'Deleted');

-- DropTable
DROP TABLE "GitHubRepository";

-- DropEnum
DROP TYPE "EnumGitHubRepositoryStatus";

-- CreateTable
CREATE TABLE "GitRepositoryPull" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pushedAt" TIMESTAMP(3),
    "provider" TEXT,
    "owner" TEXT,
    "branch" TEXT,
    "status" "EnumGitRepositoryPullStatus",
    "name" TEXT,

    CONSTRAINT "GitRepositoryPull_pkey" PRIMARY KEY ("id")
);
