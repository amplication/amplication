-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropIndex
DROP INDEX "App.organizationId_name_unique";

-- DropIndex
DROP INDEX "User.accountId_organizationId_unique";

-- AlterTable
ALTER TABLE "App" 
RENAME COLUMN "organizationId" TO "workspaceId";

-- AlterTable
ALTER TABLE "User" 
RENAME COLUMN "organizationId" TO "workspaceId";

-- AlterIndex
ALTER INDEX "Organization.name_unique" RENAME TO "Workspace.name_unique";

-- AlterTable - DropColumn
ALTER TABLE "Organization"
DROP COLUMN "defaultTimeZone";

-- AlterTable - DropColumn
ALTER TABLE "Organization"
DROP COLUMN "address";

-- AlterTable - Rename
ALTER TABLE "Organization"
RENAME TO "Workspace";

-- CreateIndex
CREATE UNIQUE INDEX "App.workspaceId_name_unique" ON "App"("workspaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User.accountId_workspaceId_unique" ON "User"("accountId", "workspaceId");

-- AddForeignKey
ALTER TABLE "App" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
