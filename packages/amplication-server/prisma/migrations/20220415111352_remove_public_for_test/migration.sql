/*
  Warnings:

  - The values [Public] on the enum `EnumEntityPermissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumEntityPermissionType_new" AS ENUM ('AllRoles', 'Granular', 'Disabled');
ALTER TABLE "EntityPermission" ALTER COLUMN "type" TYPE "EnumEntityPermissionType_new" USING ("type"::text::"EnumEntityPermissionType_new");
ALTER TYPE "EnumEntityPermissionType" RENAME TO "EnumEntityPermissionType_old";
ALTER TYPE "EnumEntityPermissionType_new" RENAME TO "EnumEntityPermissionType";
DROP TYPE "EnumEntityPermissionType_old";
COMMIT;
