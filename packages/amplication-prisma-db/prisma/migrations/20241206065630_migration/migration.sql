-- AlterTable
ALTER TABLE "CustomProperty" ADD COLUMN     "blueprintId" TEXT;

-- AddForeignKey
ALTER TABLE "CustomProperty" ADD CONSTRAINT "CustomProperty_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "Blueprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
