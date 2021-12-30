-- AlterTable
ALTER TABLE "Workspace" RENAME CONSTRAINT "Organization_pkey" TO "Workspace_pkey";

-- RenameIndex
ALTER INDEX "Account.currentUserId_unique" RENAME TO "Account_currentUserId_key";

-- RenameIndex
ALTER INDEX "Account.email_unique" RENAME TO "Account_email_key";

-- RenameIndex
ALTER INDEX "ApiToken.userId_name_unique" RENAME TO "ApiToken_userId_name_key";

-- RenameIndex
ALTER INDEX "App.workspaceId_name_unique" RENAME TO "App_workspaceId_name_key";

-- RenameIndex
ALTER INDEX "AppRole.appId_displayName_unique" RENAME TO "AppRole_appId_displayName_key";

-- RenameIndex
ALTER INDEX "AppRole.appId_name_unique" RENAME TO "AppRole_appId_name_key";

-- RenameIndex
ALTER INDEX "Block.appId_displayName_unique" RENAME TO "Block_appId_displayName_key";

-- RenameIndex
ALTER INDEX "BlockVersion.blockId_versionNumber_unique" RENAME TO "BlockVersion_blockId_versionNumber_key";

-- RenameIndex
ALTER INDEX "Build.appId_version_unique" RENAME TO "Build_appId_version_key";

-- RenameIndex
ALTER INDEX "Entity.appId_displayName_unique" RENAME TO "Entity_appId_displayName_key";

-- RenameIndex
ALTER INDEX "Entity.appId_name_unique" RENAME TO "Entity_appId_name_key";

-- RenameIndex
ALTER INDEX "Entity.appId_pluralDisplayName_unique" RENAME TO "Entity_appId_pluralDisplayName_key";

-- RenameIndex
ALTER INDEX "EntityField.entityVersionId_displayName_unique" RENAME TO "EntityField_entityVersionId_displayName_key";

-- RenameIndex
ALTER INDEX "EntityField.entityVersionId_name_unique" RENAME TO "EntityField_entityVersionId_name_key";

-- RenameIndex
ALTER INDEX "EntityField.entityVersionId_permanentId_unique" RENAME TO "EntityField_entityVersionId_permanentId_key";

-- RenameIndex
ALTER INDEX "EntityPermission.entityVersionId_action_unique" RENAME TO "EntityPermission_entityVersionId_action_key";

-- RenameIndex
ALTER INDEX "EntityPermissionField.permissionId_fieldPermanentId_unique" RENAME TO "EntityPermissionField_permissionId_fieldPermanentId_key";

-- RenameIndex
ALTER INDEX "EntityPermissionRole.entityVersionId_action_appRoleId_unique" RENAME TO "EntityPermissionRole_entityVersionId_action_appRoleId_key";

-- RenameIndex
ALTER INDEX "EntityVersion.entityId_versionNumber_unique" RENAME TO "EntityVersion_entityId_versionNumber_key";

-- RenameIndex
ALTER INDEX "Environment.appId_name_unique" RENAME TO "Environment_appId_name_key";

-- RenameIndex
ALTER INDEX "User.accountId_workspaceId_unique" RENAME TO "User_accountId_workspaceId_key";

-- RenameIndex
ALTER INDEX "UserRole.userId_role_unique" RENAME TO "UserRole_userId_role_key";

-- RenameIndex
ALTER INDEX "Workspace.name_unique" RENAME TO "Workspace_name_key";
