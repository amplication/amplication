-- Add gitRepositoryId to Resource
ALTER TABLE "Resource" ADD COLUMN     "gitRepositoryId" TEXT,
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_gitRepositoryId_fkey" FOREIGN KEY ("gitRepositoryId") REFERENCES "GitRepository"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
