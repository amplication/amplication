-- AlterTable
ALTER TABLE "CustomProperty" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validationMessage" TEXT,
ADD COLUMN     "validationRule" TEXT;
