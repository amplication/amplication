/*
  Warnings:

  - A unique constraint covering the columns `[appId]` on the table `GitRepository` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appId` to the `GitRepository` table without a default value. This is not possible if the table is not empty.
  - Made the column `gitOrganizationId` on table `GitRepository` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_gitRepositoryId_fkey";

-- DropForeignKey
ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_gitOrganizationId_fkey";

-- AlterTable
ALTER TABLE "GitRepository" ADD COLUMN     "appId" TEXT NOT NULL,
ALTER COLUMN "gitOrganizationId" SET NOT NULL;

-- DropEnum
DROP TYPE "EnumProvider";

-- CreateIndex
CREATE UNIQUE INDEX "GitRepository_appId_key" ON "GitRepository"("appId");

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_gitOrganizationId_fkey" FOREIGN KEY ("gitOrganizationId") REFERENCES "GitOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
