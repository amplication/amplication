-- CreateEnum
CREATE TYPE "EnumBuildStatus" AS ENUM ('Running', 'Completed', 'Failed', 'Invalid', 'Unknown');

-- CreateEnum
CREATE TYPE "EnumBuildGitStatus" AS ENUM ('NotConnected', 'Waiting', 'Completed', 'Failed', 'Canceled', 'Unknown');

-- AlterTable
ALTER TABLE "Build" ADD COLUMN     "gitStatus" "EnumBuildGitStatus" NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "status" "EnumBuildStatus" NOT NULL DEFAULT 'Unknown';

-- CreateTable
CREATE TABLE "BuildPlugin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buildId" TEXT NOT NULL,
    "requestedFullPackageName" TEXT NOT NULL,
    "pacakgeName" TEXT NOT NULL,
    "pacakgeVersion" TEXT NOT NULL,

    CONSTRAINT "BuildPlugin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BuildPlugin" ADD CONSTRAINT "BuildPlugin_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
