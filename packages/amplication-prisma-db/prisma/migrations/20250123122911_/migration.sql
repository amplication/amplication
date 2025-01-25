-- AlterTable
ALTER TABLE "Blueprint" ADD COLUMN     "codeGeneratorName" TEXT NOT NULL DEFAULT 'Blueprint',
ADD COLUMN     "resourceType" "EnumResourceType" NOT NULL DEFAULT 'Component';
