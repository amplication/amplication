-- CreateTable
CREATE TABLE "ResourceRelationCache" (
    "id" TEXT NOT NULL,
    "parentResourceId" TEXT NOT NULL,
    "relationKey" TEXT NOT NULL,
    "childResourceId" TEXT NOT NULL,
    "parentShouldBuildWithChild" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResourceRelationCache_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceRelationCache" ADD CONSTRAINT "ResourceRelationCache_parentResourceId_fkey" FOREIGN KEY ("parentResourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRelationCache" ADD CONSTRAINT "ResourceRelationCache_childResourceId_fkey" FOREIGN KEY ("childResourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
