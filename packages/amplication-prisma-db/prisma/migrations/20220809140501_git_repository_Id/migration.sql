-- Add gitRepositoryId to Resource
ALTER TABLE "Resource" ADD COLUMN     "gitRepositoryId" TEXT;
ALTER TABLE "Resource" ADD COLUMN     "gitRepositoryOverride" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_gitRepositoryId_fkey" FOREIGN KEY ("gitRepositoryId") REFERENCES "GitRepository"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Extract the data from GitRepository and insert it into the Resource table fkeys
UPDATE "Resource" r
SET "gitRepositoryId" = g.id
FROM "GitRepository" g
WHERE g."resourceId" IS NOT NULL
	AND g."resourceId" = r.id;

-- Add the gitRepositoryOverride column to the Resource table for existing tables make the value true
UPDATE "Resource" SET "gitRepositoryOverride" = true WHERE "gitRepositoryId" IS NOT NULL;

-- Drop the data from the GitRepository table
ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_resourceId_fkey";
DROP INDEX "GitRepository_resourceId_key";
ALTER TABLE "GitRepository" DROP COLUMN "resourceId";
