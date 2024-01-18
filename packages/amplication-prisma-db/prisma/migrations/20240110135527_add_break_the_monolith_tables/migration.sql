-- CreateTable
CREATE TABLE "BtmResourceRecommendation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "BtmResourceRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BtmEntityRecommendation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "fields" TEXT[],
    "btmResourceRecommendationId" TEXT NOT NULL,

    CONSTRAINT "BtmEntityRecommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BtmResourceRecommendation" ADD CONSTRAINT "BtmResourceRecommendation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BtmEntityRecommendation" ADD CONSTRAINT "BtmEntityRecommendation_btmResourceRecommendationId_fkey" FOREIGN KEY ("btmResourceRecommendationId") REFERENCES "BtmResourceRecommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
