-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "Commit"
SET "projectId" = "Resource"."projectId"
FROM "Resource" 
WHERE "Resource"."id" = "Commit"."resourceId";
