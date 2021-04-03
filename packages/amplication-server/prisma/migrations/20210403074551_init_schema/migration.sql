-- CreateEnum
CREATE TYPE "EnumEntityAction" AS ENUM ('View', 'Create', 'Update', 'Delete', 'Search');

-- CreateEnum
CREATE TYPE "EnumEntityPermissionType" AS ENUM ('AllRoles', 'Granular', 'Disabled');

-- CreateEnum
CREATE TYPE "EnumDataType" AS ENUM ('SingleLineText', 'MultiLineText', 'Email', 'WholeNumber', 'DateTime', 'DecimalNumber', 'Lookup', 'MultiSelectOptionSet', 'OptionSet', 'Boolean', 'Id', 'CreatedAt', 'UpdatedAt', 'GeographicLocation', 'Roles', 'Username', 'Password');

-- CreateEnum
CREATE TYPE "EnumBlockType" AS ENUM ('AppSettings', 'Flow', 'ConnectorRestApi', 'ConnectorRestApiCall', 'ConnectorSoapApi', 'ConnectorFile', 'EntityApi', 'EntityApiEndpoint', 'FlowApi', 'Layout', 'CanvasPage', 'EntityPage', 'Document');

-- CreateEnum
CREATE TYPE "ActionStepStatus" AS ENUM ('Waiting', 'Running', 'Failed', 'Success');

-- CreateEnum
CREATE TYPE "EnumLogLevel" AS ENUM ('Error', 'Warning', 'Info', 'Debug');

-- CreateEnum
CREATE TYPE "EnumDeploymentStatus" AS ENUM ('Completed', 'Waiting', 'Failed', 'Removed');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "currentUserId" TEXT,
    "githubId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "defaultTimeZone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "previewChars" TEXT NOT NULL,
    "lastAccessAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT E'#20A4F3',
    "githubToken" TEXT,
    "githubTokenCreatedDate" TIMESTAMP(3),
    "githubSyncEnabled" BOOLEAN NOT NULL DEFAULT false,
    "githubRepo" TEXT,
    "githubBranch" TEXT,
    "githubLastSync" TIMESTAMP(3),
    "githubLastMessage" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "pluralDisplayName" TEXT NOT NULL,
    "description" TEXT,
    "lockedByUserId" TEXT,
    "lockedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entityId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "pluralDisplayName" TEXT NOT NULL,
    "description" TEXT,
    "commitId" TEXT,
    "deleted" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityPermission" (
    "id" TEXT NOT NULL,
    "entityVersionId" TEXT NOT NULL,
    "action" "EnumEntityAction" NOT NULL,
    "type" "EnumEntityPermissionType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityPermissionRole" (
    "id" TEXT NOT NULL,
    "entityVersionId" TEXT NOT NULL,
    "action" "EnumEntityAction" NOT NULL,
    "appRoleId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityPermissionField" (
    "id" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "fieldPermanentId" TEXT NOT NULL,
    "entityVersionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityField" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entityVersionId" TEXT NOT NULL,
    "permanentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dataType" "EnumDataType" NOT NULL,
    "properties" JSONB NOT NULL,
    "required" BOOLEAN NOT NULL,
    "searchable" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "position" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appId" TEXT NOT NULL,
    "parentBlockId" TEXT,
    "blockType" "EnumBlockType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "inputParameters" JSONB,
    "outputParameters" JSONB,
    "settings" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionStep" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "status" "ActionStepStatus" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "actionId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "level" "EnumLogLevel" NOT NULL,
    "stepId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "message" TEXT,
    "actionId" TEXT NOT NULL,
    "images" TEXT[],
    "containerStatusQuery" JSONB,
    "containerStatusUpdatedAt" TIMESTAMP(3),
    "commitId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "commitId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "status" "EnumDeploymentStatus" NOT NULL,
    "message" TEXT,
    "actionId" TEXT NOT NULL,
    "statusQuery" JSONB,
    "statusUpdatedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuildToEntityVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EntityPermissionFieldToEntityPermissionRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockVersionToBuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.email_unique" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account.currentUserId_unique" ON "Account"("currentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization.name_unique" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.accountId_organizationId_unique" ON "User"("accountId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole.userId_role_unique" ON "UserRole"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken.userId_name_unique" ON "ApiToken"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "App.organizationId_name_unique" ON "App"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AppRole.appId_displayName_unique" ON "AppRole"("appId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "AppRole.appId_name_unique" ON "AppRole"("appId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Entity.appId_displayName_unique" ON "Entity"("appId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Entity.appId_name_unique" ON "Entity"("appId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Entity.appId_pluralDisplayName_unique" ON "Entity"("appId", "pluralDisplayName");

-- CreateIndex
CREATE UNIQUE INDEX "EntityVersion.entityId_versionNumber_unique" ON "EntityVersion"("entityId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EntityPermission.entityVersionId_action_unique" ON "EntityPermission"("entityVersionId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "EntityPermissionRole.entityVersionId_action_appRoleId_unique" ON "EntityPermissionRole"("entityVersionId", "action", "appRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityPermissionField.permissionId_fieldPermanentId_unique" ON "EntityPermissionField"("permissionId", "fieldPermanentId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityField.entityVersionId_displayName_unique" ON "EntityField"("entityVersionId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "EntityField.entityVersionId_name_unique" ON "EntityField"("entityVersionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityField.entityVersionId_permanentId_unique" ON "EntityField"("entityVersionId", "permanentId");

-- CreateIndex
CREATE UNIQUE INDEX "Block.appId_displayName_unique" ON "Block"("appId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "BlockVersion.blockId_versionNumber_unique" ON "BlockVersion"("blockId", "versionNumber");

-- CreateIndex
CREATE INDEX "ActionStep.actionId_index" ON "ActionStep"("actionId");

-- CreateIndex
CREATE INDEX "ActionLog.stepId_index" ON "ActionLog"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "Build.appId_version_unique" ON "Build"("appId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Environment.appId_name_unique" ON "Environment"("appId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_BuildToEntityVersion_AB_unique" ON "_BuildToEntityVersion"("A", "B");

-- CreateIndex
CREATE INDEX "_BuildToEntityVersion_B_index" ON "_BuildToEntityVersion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EntityPermissionFieldToEntityPermissionRole_AB_unique" ON "_EntityPermissionFieldToEntityPermissionRole"("A", "B");

-- CreateIndex
CREATE INDEX "_EntityPermissionFieldToEntityPermissionRole_B_index" ON "_EntityPermissionFieldToEntityPermissionRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockVersionToBuild_AB_unique" ON "_BlockVersionToBuild"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockVersionToBuild_B_index" ON "_BlockVersionToBuild"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY ("currentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRole" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD FOREIGN KEY ("lockedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityVersion" ADD FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityVersion" ADD FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPermission" ADD FOREIGN KEY ("entityVersionId") REFERENCES "EntityVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPermissionRole" ADD FOREIGN KEY ("appRoleId") REFERENCES "AppRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPermissionRole" ADD FOREIGN KEY ("entityVersionId", "action") REFERENCES "EntityPermission"("entityVersionId", "action") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPermissionField" ADD FOREIGN KEY ("fieldPermanentId", "entityVersionId") REFERENCES "EntityField"("permanentId", "entityVersionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPermissionField" ADD FOREIGN KEY ("permissionId") REFERENCES "EntityPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityField" ADD FOREIGN KEY ("entityVersionId") REFERENCES "EntityVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD FOREIGN KEY ("parentBlockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockVersion" ADD FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" ADD FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLog" ADD FOREIGN KEY ("stepId") REFERENCES "ActionStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release" ADD FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildToEntityVersion" ADD FOREIGN KEY ("A") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildToEntityVersion" ADD FOREIGN KEY ("B") REFERENCES "EntityVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityPermissionFieldToEntityPermissionRole" ADD FOREIGN KEY ("A") REFERENCES "EntityPermissionField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityPermissionFieldToEntityPermissionRole" ADD FOREIGN KEY ("B") REFERENCES "EntityPermissionRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockVersionToBuild" ADD FOREIGN KEY ("A") REFERENCES "BlockVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockVersionToBuild" ADD FOREIGN KEY ("B") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
