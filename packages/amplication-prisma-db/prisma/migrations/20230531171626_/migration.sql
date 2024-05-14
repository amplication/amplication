-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "demoRepoName" TEXT,
ADD COLUMN     "useDemoRepo" BOOLEAN NOT NULL DEFAULT false;
