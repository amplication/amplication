-- DropForeignKey
ALTER TABLE "BtmEntityRecommendation" DROP CONSTRAINT "BtmEntityRecommendation_btmResourceRecommendationId_fkey";

-- AddForeignKey
ALTER TABLE "BtmEntityRecommendation" ADD CONSTRAINT "BtmEntityRecommendation_btmResourceRecommendationId_fkey" FOREIGN KEY ("btmResourceRecommendationId") REFERENCES "BtmResourceRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
