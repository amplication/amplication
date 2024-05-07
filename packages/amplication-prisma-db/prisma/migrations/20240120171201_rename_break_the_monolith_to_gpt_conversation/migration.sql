-- AlterEnum
BEGIN;
CREATE TYPE "EnumUserActionType_new" AS ENUM ('DBSchemaImport', 'GptConversation');
ALTER TABLE "UserAction" ALTER COLUMN "userActionType" TYPE "EnumUserActionType_new" USING ("userActionType"::text::"EnumUserActionType_new");
ALTER TYPE "EnumUserActionType" RENAME TO "EnumUserActionType_old";
ALTER TYPE "EnumUserActionType_new" RENAME TO "EnumUserActionType";
DROP TYPE "EnumUserActionType_old";
COMMIT;
