/*
  Warnings:

  - You are about to drop the column `label` on the `BlockVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "lockedByUserId" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BlockVersion" DROP COLUMN "label",
ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "commitId" TEXT,
ADD COLUMN     "deleted" BOOLEAN;

-- AddForeignKey
ALTER TABLE "Block" ADD FOREIGN KEY ("lockedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockVersion" ADD FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
