-- App work
ALTER TABLE "App"
RENAME TO "Resource";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_pkey" TO "Resource_pkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_workspaceId_fkey" TO "Resource_workspaceId_fkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_projectId_fkey" TO "Resource_projectId_fkey";
ALTER INDEX "App.workspaceId_name_unique" RENAME TO "Resource.workspaceId_name_unique";

-- GitRepository work
ALTER TABLE "GitRepository"
RENAME "appId" TO "resource";
ALTER TABLE "GitRepository" RENAME CONSTRAINT  "GitRepository_appId_fkey" TO "GitRepository_resourceId_fkey";

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