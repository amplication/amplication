/*
  Warnings:

  - The values [Flow,ConnectorRestApi,ConnectorRestApiCall,ConnectorSoapApi,ConnectorFile,EntityApi,EntityApiEndpoint,FlowApi,Layout,CanvasPage,EntityPage,Document] on the enum `EnumBlockType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumBlockType_new" AS ENUM ('ServiceSettings', 'ProjectConfigurationSettings', 'Topic', 'ServiceTopics', 'PluginInstallation', 'PluginOrder');
ALTER TABLE "Block" ALTER COLUMN "blockType" TYPE "EnumBlockType_new" USING ("blockType"::text::"EnumBlockType_new");
ALTER TYPE "EnumBlockType" RENAME TO "EnumBlockType_old";
ALTER TYPE "EnumBlockType_new" RENAME TO "EnumBlockType";
DROP TYPE "EnumBlockType_old";
COMMIT;
