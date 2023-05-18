-- Update the existing values to ServiceSettings
UPDATE "Block" SET "blockType" = 'ServiceSettings' WHERE "blockType" = 'AppSettings'::text::"EnumBlockType";

-- Remove old enum value of AppSettings
BEGIN;
CREATE TYPE "EnumBlockType_new" AS ENUM ('ServiceSettings', 'Flow', 'ConnectorRestApi', 'ConnectorRestApiCall', 'ConnectorSoapApi', 'ConnectorFile', 'EntityApi', 'EntityApiEndpoint', 'FlowApi', 'Layout', 'CanvasPage', 'EntityPage', 'Document');
ALTER TABLE "Block" ALTER COLUMN "blockType" TYPE "EnumBlockType_new" USING ("blockType"::text::"EnumBlockType_new");
ALTER TYPE "EnumBlockType" RENAME TO "EnumBlockType_old";
ALTER TYPE "EnumBlockType_new" RENAME TO "EnumBlockType";
DROP TYPE "EnumBlockType_old";
COMMIT;

