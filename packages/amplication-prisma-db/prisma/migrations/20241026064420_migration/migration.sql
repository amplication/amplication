-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "ownershipId" TEXT;

-- CreateTable
CREATE TABLE "Ownership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,

    CONSTRAINT "Ownership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_ownershipId_fkey" FOREIGN KEY ("ownershipId") REFERENCES "Ownership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
