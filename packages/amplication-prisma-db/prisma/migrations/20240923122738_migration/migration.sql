-- CreateTable
CREATE TABLE "ResourceVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "message" TEXT,
    "commitId" TEXT,

    CONSTRAINT "ResourceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntityVersionToResourceVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockVersionToResourceVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ResouceVersion.resourceId_version_unique" ON "ResourceVersion"("resourceId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "_EntityVersionToResourceVersion_AB_unique" ON "_EntityVersionToResourceVersion"("A", "B");

-- CreateIndex
CREATE INDEX "_EntityVersionToResourceVersion_B_index" ON "_EntityVersionToResourceVersion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockVersionToResourceVersion_AB_unique" ON "_BlockVersionToResourceVersion"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockVersionToResourceVersion_B_index" ON "_BlockVersionToResourceVersion"("B");

-- AddForeignKey
ALTER TABLE "ResourceVersion" ADD CONSTRAINT "ResourceVersion_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceVersion" ADD CONSTRAINT "ResourceVersion_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceVersion" ADD CONSTRAINT "ResourceVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityVersionToResourceVersion" ADD CONSTRAINT "_EntityVersionToResourceVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "EntityVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityVersionToResourceVersion" ADD CONSTRAINT "_EntityVersionToResourceVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "ResourceVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockVersionToResourceVersion" ADD CONSTRAINT "_BlockVersionToResourceVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockVersionToResourceVersion" ADD CONSTRAINT "_BlockVersionToResourceVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "ResourceVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
