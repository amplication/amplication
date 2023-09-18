-- CreateEnum
CREATE TYPE "CodeGeneratorVersionStrategy" AS ENUM ('LatestMajor', 'LatestMinor', 'Specific');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "codeGeneratorStrategy" "CodeGeneratorVersionStrategy" NOT NULL DEFAULT 'LatestMajor',
ADD COLUMN     "codeGeneratorVersion" TEXT;
