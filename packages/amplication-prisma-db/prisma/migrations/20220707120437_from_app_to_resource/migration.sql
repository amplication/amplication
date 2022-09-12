-- App work
ALTER TABLE "App"
RENAME TO "Resource";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_pkey" TO "Resource_pkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_workspaceId_fkey" TO "Resource_workspaceId_fkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_projectId_fkey" TO "Resource_projectId_fkey";
ALTER INDEX "App.workspaceId_name_unique" RENAME TO "Resource.workspaceId_name_unique";

-- GitRepository work
ALTER TABLE "GitRepository"
RENAME "appId" TO "resourceId";
ALTER TABLE "GitRepository" RENAME CONSTRAINT  "GitRepository_appId_fkey" TO "GitRepository_resourceId_fkey";
ALTER INDEX "GitRepository_appId_key" RENAME TO "GitRepository_resourceId_key";

-- Commit work
ALTER TABLE "Commit"
RENAME "appId" TO "resourceId";
ALTER TABLE "Commit" RENAME CONSTRAINT  "Commit_appId_fkey" TO "Commit_resourceId_fkey";

-- Entity work
ALTER TABLE "Entity"
RENAME "appId" TO "resourceId";
ALTER TABLE "Entity" RENAME CONSTRAINT  "Entity_appId_fkey" TO "Entity_resourceId_fkey";
ALTER INDEX "Entity.appId_displayName_unique" RENAME TO "Entity.resourceId_displayName_unique";
ALTER INDEX "Entity.appId_name_unique" RENAME TO "Entity.resourceId_name_unique";
ALTER INDEX "Entity.appId_pluralDisplayName_unique" RENAME TO "Entity.resourceId_pluralDisplayName_unique";

-- Block work
ALTER TABLE "Block"
RENAME "appId" TO "resourceId";
ALTER TABLE "Block" RENAME CONSTRAINT  "Block_appId_fkey" TO "Block_resourceId_fkey";
ALTER INDEX "Block.appId_displayName_unique" RENAME TO "Block.resourceId_displayName_unique";

-- Build work
ALTER TABLE "Build"
RENAME "appId" TO "resourceId";
ALTER TABLE "Build" RENAME CONSTRAINT  "Build_appId_fkey" TO "Build_resourceId_fkey";
ALTER INDEX "Build.appId_version_unique" RENAME TO "Build.resourceId_version_unique";

-- Environment work
ALTER TABLE "Environment"
RENAME "appId" TO "resourceId";
ALTER TABLE "Environment" RENAME CONSTRAINT  "Environment_appId_fkey" TO "Environment_resourceId_fkey";
ALTER INDEX "Environment.appId_name_unique" RENAME TO "Environment.resourceId_name_unique";

-- AppRole work
ALTER TABLE "AppRole"
RENAME TO "ResourceRole";
ALTER TABLE "ResourceRole"
RENAME "appId" TO "resourceId";
ALTER TABLE "ResourceRole" RENAME CONSTRAINT  "AppRole_pkey" TO "ResourceRole_pkey";
ALTER TABLE "ResourceRole" RENAME CONSTRAINT  "AppRole_appId_fkey" TO "ResourceRole_resourceId_fkey";
ALTER INDEX "AppRole.appId_displayName_unique" RENAME TO "ResourceRole.resourceId_displayName_unique";
ALTER INDEX "AppRole.appId_name_unique" RENAME TO "ResourceRole.resourceId_name_unique";

-- EntityPermissionRole work
ALTER TABLE "EntityPermissionRole"
RENAME "appRoleId" TO "resourceRoleId";
ALTER TABLE "EntityPermissionRole" RENAME CONSTRAINT "EntityPermissionRole_appRoleId_fkey" TO "EntityPermissionRole_resourceRoleId_fkey";
ALTER INDEX "EntityPermissionRole.entityVersionId_action_appRoleId_unique" RENAME TO "EntityPermissionRole.entityVersionId_action_resourceRoleId_uniq"; -- This map is cut in the end because a 63 bytes limit

-- CreateEnum
CREATE TYPE "EnumResourceType" AS ENUM ('Service');

-- Add value to current resources
ALTER TABLE "Resource" ADD COLUMN     "type" "EnumResourceType" NULL;
UPDATE "Resource" SET type = 'Service';
ALTER TABLE "Resource" ALTER COLUMN "type" SET NOT NULL;
