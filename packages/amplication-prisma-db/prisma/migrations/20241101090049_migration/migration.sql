-- CreateEnum
CREATE TYPE "CustomPropertyType" AS ENUM ('Text', 'Link', 'Select', 'MultiSelect');

-- CreateTable
CREATE TABLE "CustomProperty" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "type" "CustomPropertyType" NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "CustomProperty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomProperty" ADD CONSTRAINT "CustomProperty_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
