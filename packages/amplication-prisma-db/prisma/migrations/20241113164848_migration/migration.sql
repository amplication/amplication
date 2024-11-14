-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "blueprintId" TEXT;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "Blueprint"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
