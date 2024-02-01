-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "licensed" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "licensed" BOOLEAN NOT NULL DEFAULT true;
