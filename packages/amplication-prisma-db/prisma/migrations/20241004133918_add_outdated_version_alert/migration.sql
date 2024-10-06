-- CreateEnum
CREATE TYPE "EnumOutdatedVersionAlertStatus" AS ENUM ('New', 'Resolved', 'Ignored');

-- CreateEnum
CREATE TYPE "EnumOutdatedVersionAlertType" AS ENUM ('TemplateVersion', 'PluginVersion', 'CodeEngineVersion');

-- CreateTable
CREATE TABLE "OutdatedVersionAlert" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceId" TEXT NOT NULL,
    "type" "EnumOutdatedVersionAlertType" NOT NULL,
    "pluginPackageName" TEXT,
    "blockId" TEXT,
    "outdatedVersion" TEXT NOT NULL,
    "latestVersion" TEXT NOT NULL,
    "status" "EnumOutdatedVersionAlertStatus" NOT NULL DEFAULT 'New',

    CONSTRAINT "OutdatedVersionAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OutdatedVersionAlert" ADD CONSTRAINT "OutdatedVersionAlert_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutdatedVersionAlert" ADD CONSTRAINT "OutdatedVersionAlert_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
