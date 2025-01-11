-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "properties" JSONB;

-- CreateIndex
CREATE INDEX "Resource_properties_idx" ON "Resource" USING GIN ("properties" jsonb_ops);
