-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "fallbackModelId" TEXT;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_fallbackModelId_fkey" FOREIGN KEY ("fallbackModelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
