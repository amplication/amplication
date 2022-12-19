Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
} = require("./runtime/index");

const Prisma = {};

exports.Prisma = Prisma;

/**
 * Prisma Client JS version: 4.6.1
 * Query Engine version: 694eea289a8462c80264df36757e4fdc129b1b32
 */
Prisma.prismaVersion = {
  client: "4.6.1",
  engine: "694eea289a8462c80264df36757e4fdc129b1b32",
};

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = () => (val) => val;

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

const path = require("path");

const { findSync } = require("./runtime");
const fs = require("fs");

// some frameworks or bundlers replace or totally remove __dirname
const hasDirname = typeof __dirname !== "undefined" && __dirname !== "/";

// will work in most cases, ie. if the client has not been bundled
const regularDirname =
  hasDirname &&
  fs.existsSync(path.join(__dirname, "schema.prisma")) &&
  __dirname;

// if the client has been bundled, we need to look for the folders
const foundDirname =
  !regularDirname &&
  findSync(
    process.cwd(),
    [
      "../amplication-server/prisma/generated-prisma-client",
      "amplication-server/prisma/generated-prisma-client",
    ],
    ["d"],
    ["d"],
    1
  )[0];

const dirname = regularDirname || foundDirname || __dirname;

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) {
  return x;
}

exports.Prisma.AccountScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  currentUserId: "currentUserId",
  githubId: "githubId",
});

exports.Prisma.ActionLogScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  message: "message",
  meta: "meta",
  level: "level",
  stepId: "stepId",
});

exports.Prisma.ActionScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
});

exports.Prisma.ActionStepScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  message: "message",
  status: "status",
  completedAt: "completedAt",
  actionId: "actionId",
  name: "name",
});

exports.Prisma.ApiTokenScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  name: "name",
  userId: "userId",
  token: "token",
  previewChars: "previewChars",
  lastAccessAt: "lastAccessAt",
});

exports.Prisma.BlockScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  resourceId: "resourceId",
  parentBlockId: "parentBlockId",
  blockType: "blockType",
  displayName: "displayName",
  description: "description",
  lockedByUserId: "lockedByUserId",
  lockedAt: "lockedAt",
  deletedAt: "deletedAt",
});

exports.Prisma.BlockVersionScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  blockId: "blockId",
  versionNumber: "versionNumber",
  inputParameters: "inputParameters",
  outputParameters: "outputParameters",
  settings: "settings",
  displayName: "displayName",
  description: "description",
  commitId: "commitId",
  deleted: "deleted",
});

exports.Prisma.BuildScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  resourceId: "resourceId",
  userId: "userId",
  version: "version",
  message: "message",
  actionId: "actionId",
  images: "images",
  containerStatusQuery: "containerStatusQuery",
  containerStatusUpdatedAt: "containerStatusUpdatedAt",
  commitId: "commitId",
});

exports.Prisma.CommitScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  userId: "userId",
  message: "message",
  projectId: "projectId",
});

exports.Prisma.DeploymentScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  userId: "userId",
  buildId: "buildId",
  environmentId: "environmentId",
  status: "status",
  message: "message",
  actionId: "actionId",
  statusQuery: "statusQuery",
  statusUpdatedAt: "statusUpdatedAt",
});

exports.Prisma.EntityFieldScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  entityVersionId: "entityVersionId",
  permanentId: "permanentId",
  name: "name",
  displayName: "displayName",
  dataType: "dataType",
  properties: "properties",
  required: "required",
  searchable: "searchable",
  description: "description",
  position: "position",
  unique: "unique",
});

exports.Prisma.EntityPermissionFieldScalarFieldEnum = makeEnum({
  id: "id",
  permissionId: "permissionId",
  fieldPermanentId: "fieldPermanentId",
  entityVersionId: "entityVersionId",
});

exports.Prisma.EntityPermissionRoleScalarFieldEnum = makeEnum({
  id: "id",
  entityVersionId: "entityVersionId",
  action: "action",
  resourceRoleId: "resourceRoleId",
});

exports.Prisma.EntityPermissionScalarFieldEnum = makeEnum({
  id: "id",
  entityVersionId: "entityVersionId",
  action: "action",
  type: "type",
});

exports.Prisma.EntityScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  resourceId: "resourceId",
  name: "name",
  displayName: "displayName",
  pluralDisplayName: "pluralDisplayName",
  description: "description",
  lockedByUserId: "lockedByUserId",
  lockedAt: "lockedAt",
  deletedAt: "deletedAt",
});

exports.Prisma.EntityVersionScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  entityId: "entityId",
  versionNumber: "versionNumber",
  name: "name",
  displayName: "displayName",
  pluralDisplayName: "pluralDisplayName",
  description: "description",
  commitId: "commitId",
  deleted: "deleted",
});

exports.Prisma.EnvironmentScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  resourceId: "resourceId",
  name: "name",
  description: "description",
  address: "address",
});

exports.Prisma.GitOrganizationScalarFieldEnum = makeEnum({
  id: "id",
  provider: "provider",
  name: "name",
  installationId: "installationId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  workspaceId: "workspaceId",
  type: "type",
});

exports.Prisma.GitRepositoryScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  gitOrganizationId: "gitOrganizationId",
});

exports.Prisma.InvitationScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  email: "email",
  invitedByUserId: "invitedByUserId",
  workspaceId: "workspaceId",
  newUserId: "newUserId",
  token: "token",
  tokenExpiration: "tokenExpiration",
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull,
});

exports.Prisma.JsonNullValueInput = makeEnum({
  JsonNull: Prisma.JsonNull,
});

exports.Prisma.NullableJsonNullValueInput = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
});

exports.Prisma.ProjectScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  workspaceId: "workspaceId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
});

exports.Prisma.QueryMode = makeEnum({
  default: "default",
  insensitive: "insensitive",
});

exports.Prisma.ReleaseScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  version: "version",
  description: "description",
  commitId: "commitId",
});

exports.Prisma.ResourceRoleScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  resourceId: "resourceId",
  name: "name",
  displayName: "displayName",
  description: "description",
});

exports.Prisma.ResourceScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  name: "name",
  description: "description",
  gitRepositoryOverride: "gitRepositoryOverride",
  githubLastSync: "githubLastSync",
  githubLastMessage: "githubLastMessage",
  deletedAt: "deletedAt",
  gitRepositoryId: "gitRepositoryId",
  projectId: "projectId",
  resourceType: "resourceType",
});

exports.Prisma.SortOrder = makeEnum({
  asc: "asc",
  desc: "desc",
});

exports.Prisma.SubscriptionScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  workspaceId: "workspaceId",
  subscriptionPlan: "subscriptionPlan",
  status: "status",
  subscriptionData: "subscriptionData",
  cancellationEffectiveDate: "cancellationEffectiveDate",
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable",
});

exports.Prisma.UserRoleScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  role: "role",
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  accountId: "accountId",
  workspaceId: "workspaceId",
  isOwner: "isOwner",
  deletedAt: "deletedAt",
});

exports.Prisma.WorkspaceScalarFieldEnum = makeEnum({
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  name: "name",
});
exports.ActionStepStatus = makeEnum({
  Waiting: "Waiting",
  Running: "Running",
  Failed: "Failed",
  Success: "Success",
});

exports.EnumBlockType = makeEnum({
  ServiceSettings: "ServiceSettings",
  ProjectConfigurationSettings: "ProjectConfigurationSettings",
  Topic: "Topic",
  ServiceTopics: "ServiceTopics",
  PluginInstallation: "PluginInstallation",
  PluginOrder: "PluginOrder",
});

exports.EnumDataType = makeEnum({
  SingleLineText: "SingleLineText",
  MultiLineText: "MultiLineText",
  Email: "Email",
  WholeNumber: "WholeNumber",
  DateTime: "DateTime",
  DecimalNumber: "DecimalNumber",
  Lookup: "Lookup",
  MultiSelectOptionSet: "MultiSelectOptionSet",
  OptionSet: "OptionSet",
  Boolean: "Boolean",
  Id: "Id",
  CreatedAt: "CreatedAt",
  UpdatedAt: "UpdatedAt",
  GeographicLocation: "GeographicLocation",
  Roles: "Roles",
  Username: "Username",
  Password: "Password",
  Json: "Json",
});

exports.EnumDeploymentStatus = makeEnum({
  Completed: "Completed",
  Waiting: "Waiting",
  Failed: "Failed",
  Removed: "Removed",
});

exports.EnumEntityAction = makeEnum({
  View: "View",
  Create: "Create",
  Update: "Update",
  Delete: "Delete",
  Search: "Search",
});

exports.EnumEntityPermissionType = makeEnum({
  AllRoles: "AllRoles",
  Granular: "Granular",
  Disabled: "Disabled",
  Public: "Public",
});

exports.EnumGitOrganizationType = makeEnum({
  User: "User",
  Organization: "Organization",
});

exports.EnumGitProvider = makeEnum({
  Github: "Github",
});

exports.EnumLogLevel = makeEnum({
  Error: "Error",
  Warning: "Warning",
  Info: "Info",
  Debug: "Debug",
});

exports.EnumResourceType = makeEnum({
  Service: "Service",
  ProjectConfiguration: "ProjectConfiguration",
  MessageBroker: "MessageBroker",
});

exports.EnumSubscriptionPlan = makeEnum({
  Pro: "Pro",
  Business: "Business",
  Enterprise: "Enterprise",
});

exports.EnumSubscriptionStatus = makeEnum({
  Active: "Active",
  Trailing: "Trailing",
  PastDue: "PastDue",
  Paused: "Paused",
  Deleted: "Deleted",
});

exports.Prisma.ModelName = makeEnum({
  Account: "Account",
  Workspace: "Workspace",
  Project: "Project",
  GitOrganization: "GitOrganization",
  GitRepository: "GitRepository",
  User: "User",
  UserRole: "UserRole",
  ApiToken: "ApiToken",
  Resource: "Resource",
  ResourceRole: "ResourceRole",
  Commit: "Commit",
  Entity: "Entity",
  EntityVersion: "EntityVersion",
  EntityPermission: "EntityPermission",
  EntityPermissionRole: "EntityPermissionRole",
  EntityPermissionField: "EntityPermissionField",
  EntityField: "EntityField",
  Block: "Block",
  BlockVersion: "BlockVersion",
  Action: "Action",
  ActionStep: "ActionStep",
  ActionLog: "ActionLog",
  Build: "Build",
  Release: "Release",
  Environment: "Environment",
  Deployment: "Deployment",
  Invitation: "Invitation",
  Subscription: "Subscription",
});

const dmmfString =
  '{"datamodel":{"enums":[{"name":"EnumEntityAction","values":[{"name":"View","dbName":null},{"name":"Create","dbName":null},{"name":"Update","dbName":null},{"name":"Delete","dbName":null},{"name":"Search","dbName":null}],"dbName":null},{"name":"EnumEntityPermissionType","values":[{"name":"AllRoles","dbName":null},{"name":"Granular","dbName":null},{"name":"Disabled","dbName":null},{"name":"Public","dbName":null}],"dbName":null},{"name":"EnumDataType","values":[{"name":"SingleLineText","dbName":null},{"name":"MultiLineText","dbName":null},{"name":"Email","dbName":null},{"name":"WholeNumber","dbName":null},{"name":"DateTime","dbName":null},{"name":"DecimalNumber","dbName":null},{"name":"Lookup","dbName":null},{"name":"MultiSelectOptionSet","dbName":null},{"name":"OptionSet","dbName":null},{"name":"Boolean","dbName":null},{"name":"Id","dbName":null},{"name":"CreatedAt","dbName":null},{"name":"UpdatedAt","dbName":null},{"name":"GeographicLocation","dbName":null},{"name":"Roles","dbName":null},{"name":"Username","dbName":null},{"name":"Password","dbName":null},{"name":"Json","dbName":null}],"dbName":null},{"name":"EnumBlockType","values":[{"name":"ServiceSettings","dbName":null},{"name":"ProjectConfigurationSettings","dbName":null},{"name":"Topic","dbName":null},{"name":"ServiceTopics","dbName":null},{"name":"PluginInstallation","dbName":null},{"name":"PluginOrder","dbName":null}],"dbName":null},{"name":"ActionStepStatus","values":[{"name":"Waiting","dbName":null},{"name":"Running","dbName":null},{"name":"Failed","dbName":null},{"name":"Success","dbName":null}],"dbName":null},{"name":"EnumLogLevel","values":[{"name":"Error","dbName":null},{"name":"Warning","dbName":null},{"name":"Info","dbName":null},{"name":"Debug","dbName":null}],"dbName":null},{"name":"EnumDeploymentStatus","values":[{"name":"Completed","dbName":null},{"name":"Waiting","dbName":null},{"name":"Failed","dbName":null},{"name":"Removed","dbName":null}],"dbName":null},{"name":"EnumSubscriptionPlan","values":[{"name":"Pro","dbName":null},{"name":"Business","dbName":null},{"name":"Enterprise","dbName":null}],"dbName":null},{"name":"EnumSubscriptionStatus","values":[{"name":"Active","dbName":null},{"name":"Trailing","dbName":null},{"name":"PastDue","dbName":null},{"name":"Paused","dbName":null},{"name":"Deleted","dbName":null}],"dbName":null},{"name":"EnumResourceType","values":[{"name":"Service","dbName":null},{"name":"ProjectConfiguration","dbName":null},{"name":"MessageBroker","dbName":null}],"dbName":null},{"name":"EnumGitProvider","values":[{"name":"Github","dbName":null}],"dbName":null},{"name":"EnumGitOrganizationType","values":[{"name":"User","dbName":null},{"name":"Organization","dbName":null}],"dbName":null}],"models":[{"name":"Account","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"firstName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lastName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"currentUserId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"githubId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"currentUser","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"AccountToUser","relationFromFields":["currentUserId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"users","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"AccountOnUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Workspace","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"users","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"UserToWorkspace","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"invitations","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Invitation","relationName":"InvitationToWorkspace","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"subscriptions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Subscription","relationName":"SubscriptionToWorkspace","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"gitOrganizations","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"GitOrganization","relationName":"GitOrganizationToWorkspace","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"projects","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Project","relationName":"ProjectToWorkspace","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Project","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"workspaceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"workspace","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Workspace","relationName":"ProjectToWorkspace","relationFromFields":["workspaceId"],"relationToFields":["id"],"relationOnDelete":"NoAction","isGenerated":false,"isUpdatedAt":false},{"name":"resources","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"ProjectToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"deletedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"commits","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"CommitToProject","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["workspaceId","name"]],"uniqueIndexes":[{"name":null,"fields":["workspaceId","name"]}],"isGenerated":false},{"name":"GitOrganization","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"provider","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumGitProvider","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"installationId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"workspaceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"EnumGitOrganizationType","default":"User","isGenerated":false,"isUpdatedAt":false},{"name":"workspace","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Workspace","relationName":"GitOrganizationToWorkspace","relationFromFields":["workspaceId"],"relationToFields":["id"],"relationOnDelete":"NoAction","isGenerated":false,"isUpdatedAt":false},{"name":"gitRepositories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"GitRepository","relationName":"GitOrganizationToGitRepository","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["provider","installationId"]],"uniqueIndexes":[{"name":null,"fields":["provider","installationId"]}],"isGenerated":false},{"name":"GitRepository","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"gitOrganizationId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"resources","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"GitRepositoryToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"gitOrganization","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"GitOrganization","relationName":"GitOrganizationToGitRepository","relationFromFields":["gitOrganizationId"],"relationToFields":["id"],"relationOnDelete":"NoAction","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"User","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"accountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"workspaceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isOwner","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountOnUser","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"workspace","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Workspace","relationName":"UserToWorkspace","relationFromFields":["workspaceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"assignedCurrentTo","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"apiTokens","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApiToken","relationName":"ApiTokenToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"lockedBlocks","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Block","relationName":"BlockToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BuildToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"commits","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"CommitToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"deployments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Deployment","relationName":"DeploymentToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"lockedEntitis","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Entity","relationName":"EntityToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"userRoles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"UserRole","relationName":"UserToUserRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"sentInvitations","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Invitation","relationName":"InvitedByUserOnInvitation","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdFromInvitation","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Invitation","relationName":"InvitationToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"deletedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["accountId","workspaceId"]],"uniqueIndexes":[{"name":null,"fields":["accountId","workspaceId"]}],"isGenerated":false},{"name":"UserRole","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"UserToUserRole","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["userId","role"]],"uniqueIndexes":[{"name":null,"fields":["userId","role"]}],"isGenerated":false},{"name":"ApiToken","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"token","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"previewChars","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lastAccessAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"ApiTokenToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["userId","name"]],"uniqueIndexes":[{"name":null,"fields":["userId","name"]}],"isGenerated":false},{"name":"Resource","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"gitRepositoryOverride","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"githubLastSync","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"githubLastMessage","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"deletedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"gitRepositoryId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"roles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ResourceRole","relationName":"ResourceToResourceRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"blocks","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Block","relationName":"BlockToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BuildToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"entities","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Entity","relationName":"EntityToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"environments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Environment","relationName":"EnvironmentToResource","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"gitRepository","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"GitRepository","relationName":"GitRepositoryToResource","relationFromFields":["gitRepositoryId"],"relationToFields":["id"],"relationOnDelete":"NoAction","isGenerated":false,"isUpdatedAt":false},{"name":"projectId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"project","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Project","relationName":"ProjectToResource","relationFromFields":["projectId"],"relationToFields":["id"],"relationOnDelete":"NoAction","isGenerated":false,"isUpdatedAt":false},{"name":"resourceType","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumResourceType","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["projectId","name"]],"uniqueIndexes":[{"name":null,"fields":["projectId","name"]}],"isGenerated":false},{"name":"ResourceRole","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"resourceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"resource","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"ResourceToResourceRole","relationFromFields":["resourceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"entityPermissionRoles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionRole","relationName":"EntityPermissionRoleToResourceRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["resourceId","displayName"],["resourceId","name"]],"uniqueIndexes":[{"name":null,"fields":["resourceId","displayName"]},{"name":null,"fields":["resourceId","name"]}],"isGenerated":false},{"name":"Commit","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"CommitToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"blockVersions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BlockVersion","relationName":"BlockVersionToCommit","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BuildToCommit","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"entityVersions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityVersion","relationName":"CommitToEntityVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"releases","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Release","relationName":"CommitToRelease","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"project","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Project","relationName":"CommitToProject","relationFromFields":["projectId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"projectId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Entity","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"resourceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"pluralDisplayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lockedByUserId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lockedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"deletedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"resource","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"EntityToResource","relationFromFields":["resourceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"lockedByUser","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"EntityToUser","relationFromFields":["lockedByUserId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"versions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityVersion","relationName":"EntityToEntityVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["resourceId","displayName"],["resourceId","name"],["resourceId","pluralDisplayName"]],"uniqueIndexes":[{"name":null,"fields":["resourceId","displayName"]},{"name":null,"fields":["resourceId","name"]},{"name":null,"fields":["resourceId","pluralDisplayName"]}],"isGenerated":false},{"name":"EntityVersion","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"entityId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"versionNumber","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"pluralDisplayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"commitId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"deleted","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"commit","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"CommitToEntityVersion","relationFromFields":["commitId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"entity","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Entity","relationName":"EntityToEntityVersion","relationFromFields":["entityId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"fields","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityField","relationName":"EntityFieldToEntityVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"permissions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermission","relationName":"EntityPermissionToEntityVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BuildToEntityVersion","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["entityId","versionNumber"]],"uniqueIndexes":[{"name":null,"fields":["entityId","versionNumber"]}],"isGenerated":false},{"name":"EntityPermission","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"entityVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumEntityAction","isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumEntityPermissionType","isGenerated":false,"isUpdatedAt":false},{"name":"entityVersion","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityVersion","relationName":"EntityPermissionToEntityVersion","relationFromFields":["entityVersionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permissionFields","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionField","relationName":"EntityPermissionToEntityPermissionField","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"permissionRoles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionRole","relationName":"EntityPermissionToEntityPermissionRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["entityVersionId","action"]],"uniqueIndexes":[{"name":null,"fields":["entityVersionId","action"]}],"isGenerated":false},{"name":"EntityPermissionRole","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"entityVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"EnumEntityAction","isGenerated":false,"isUpdatedAt":false},{"name":"resourceRoleId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"resourceRole","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ResourceRole","relationName":"EntityPermissionRoleToResourceRole","relationFromFields":["resourceRoleId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permission","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermission","relationName":"EntityPermissionToEntityPermissionRole","relationFromFields":["entityVersionId","action"],"relationToFields":["entityVersionId","action"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permissionFields","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionField","relationName":"EntityPermissionFieldToEntityPermissionRole","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["entityVersionId","action","resourceRoleId"]],"uniqueIndexes":[{"name":null,"fields":["entityVersionId","action","resourceRoleId"]}],"isGenerated":false},{"name":"EntityPermissionField","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"permissionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"fieldPermanentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"entityVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"field","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityField","relationName":"EntityFieldToEntityPermissionField","relationFromFields":["fieldPermanentId","entityVersionId"],"relationToFields":["permanentId","entityVersionId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permission","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermission","relationName":"EntityPermissionToEntityPermissionField","relationFromFields":["permissionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permissionRoles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionRole","relationName":"EntityPermissionFieldToEntityPermissionRole","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["permissionId","fieldPermanentId"]],"uniqueIndexes":[{"name":null,"fields":["permissionId","fieldPermanentId"]}],"isGenerated":false},{"name":"EntityField","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"entityVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"permanentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"dataType","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumDataType","isGenerated":false,"isUpdatedAt":false},{"name":"properties","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"required","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"searchable","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"position","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"unique","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"entityVersion","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityVersion","relationName":"EntityFieldToEntityVersion","relationFromFields":["entityVersionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permissionField","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityPermissionField","relationName":"EntityFieldToEntityPermissionField","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["entityVersionId","displayName"],["entityVersionId","name"],["entityVersionId","permanentId"]],"uniqueIndexes":[{"name":null,"fields":["entityVersionId","displayName"]},{"name":null,"fields":["entityVersionId","name"]},{"name":null,"fields":["entityVersionId","permanentId"]}],"isGenerated":false},{"name":"Block","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"resourceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"parentBlockId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"blockType","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumBlockType","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lockedByUserId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lockedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"deletedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"resource","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"BlockToResource","relationFromFields":["resourceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"lockedByUser","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"BlockToUser","relationFromFields":["lockedByUserId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"parentBlock","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Block","relationName":"BlockToBlock","relationFromFields":["parentBlockId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"blocks","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Block","relationName":"BlockToBlock","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"versions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BlockVersion","relationName":"BlockToBlockVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["resourceId","displayName"]],"uniqueIndexes":[{"name":null,"fields":["resourceId","displayName"]}],"isGenerated":false},{"name":"BlockVersion","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"blockId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"versionNumber","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"inputParameters","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"outputParameters","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"settings","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"commitId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"deleted","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"block","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Block","relationName":"BlockToBlockVersion","relationFromFields":["blockId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"commit","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"BlockVersionToCommit","relationFromFields":["commitId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BlockVersionToBuild","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["blockId","versionNumber"]],"uniqueIndexes":[{"name":null,"fields":["blockId","versionNumber"]}],"isGenerated":false},{"name":"Action","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"steps","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ActionStep","relationName":"ActionToActionStep","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"builds","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"ActionToBuild","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"deployments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Deployment","relationName":"ActionToDeployment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"ActionStep","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ActionStepStatus","isGenerated":false,"isUpdatedAt":false},{"name":"completedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"actionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Action","relationName":"ActionToActionStep","relationFromFields":["actionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"logs","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ActionLog","relationName":"ActionLogToActionStep","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"ActionLog","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"meta","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"level","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumLogLevel","isGenerated":false,"isUpdatedAt":false},{"name":"stepId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"step","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ActionStep","relationName":"ActionLogToActionStep","relationFromFields":["stepId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Build","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"resourceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"version","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"actionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"images","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"containerStatusQuery","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"containerStatusUpdatedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"commitId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Action","relationName":"ActionToBuild","relationFromFields":["actionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"resource","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"BuildToResource","relationFromFields":["resourceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"commit","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"BuildToCommit","relationFromFields":["commitId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"createdBy","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"BuildToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"deployments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Deployment","relationName":"BuildToDeployment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"blockVersions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BlockVersion","relationName":"BlockVersionToBuild","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"entityVersions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EntityVersion","relationName":"BuildToEntityVersion","relationFromFields":[],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["resourceId","version"]],"uniqueIndexes":[{"name":null,"fields":["resourceId","version"]}],"isGenerated":false},{"name":"Release","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"version","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"commitId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"commit","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Commit","relationName":"CommitToRelease","relationFromFields":["commitId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Environment","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"resourceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"resource","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Resource","relationName":"EnvironmentToResource","relationFromFields":["resourceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"deployments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Deployment","relationName":"DeploymentToEnvironment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["resourceId","name"]],"uniqueIndexes":[{"name":null,"fields":["resourceId","name"]}],"isGenerated":false},{"name":"Deployment","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"buildId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"environmentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumDeploymentStatus","isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"actionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"statusQuery","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"statusUpdatedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Action","relationName":"ActionToDeployment","relationFromFields":["actionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"build","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Build","relationName":"BuildToDeployment","relationFromFields":["buildId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"environment","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Environment","relationName":"DeploymentToEnvironment","relationFromFields":["environmentId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdBy","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"DeploymentToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Invitation","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"invitedByUserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"invitedByUser","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"InvitedByUserOnInvitation","relationFromFields":["invitedByUserId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"workspaceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"workspace","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Workspace","relationName":"InvitationToWorkspace","relationFromFields":["workspaceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"newUserId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"newUser","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"InvitationToUser","relationFromFields":["newUserId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"token","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"tokenExpiration","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["workspaceId","email"]],"uniqueIndexes":[{"name":null,"fields":["workspaceId","email"]}],"isGenerated":false},{"name":"Subscription","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"workspaceId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"workspace","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Workspace","relationName":"SubscriptionToWorkspace","relationFromFields":["workspaceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"subscriptionPlan","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumSubscriptionPlan","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"EnumSubscriptionStatus","isGenerated":false,"isUpdatedAt":false},{"name":"subscriptionData","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"cancellationEffectiveDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}],"types":[]},"mappings":{"modelOperations":[{"model":"Account","plural":"accounts","findUnique":"findUniqueAccount","findFirst":"findFirstAccount","findMany":"findManyAccount","create":"createOneAccount","createMany":"createManyAccount","delete":"deleteOneAccount","update":"updateOneAccount","deleteMany":"deleteManyAccount","updateMany":"updateManyAccount","upsert":"upsertOneAccount","aggregate":"aggregateAccount","groupBy":"groupByAccount"},{"model":"Workspace","plural":"workspaces","findUnique":"findUniqueWorkspace","findFirst":"findFirstWorkspace","findMany":"findManyWorkspace","create":"createOneWorkspace","createMany":"createManyWorkspace","delete":"deleteOneWorkspace","update":"updateOneWorkspace","deleteMany":"deleteManyWorkspace","updateMany":"updateManyWorkspace","upsert":"upsertOneWorkspace","aggregate":"aggregateWorkspace","groupBy":"groupByWorkspace"},{"model":"Project","plural":"projects","findUnique":"findUniqueProject","findFirst":"findFirstProject","findMany":"findManyProject","create":"createOneProject","createMany":"createManyProject","delete":"deleteOneProject","update":"updateOneProject","deleteMany":"deleteManyProject","updateMany":"updateManyProject","upsert":"upsertOneProject","aggregate":"aggregateProject","groupBy":"groupByProject"},{"model":"GitOrganization","plural":"gitOrganizations","findUnique":"findUniqueGitOrganization","findFirst":"findFirstGitOrganization","findMany":"findManyGitOrganization","create":"createOneGitOrganization","createMany":"createManyGitOrganization","delete":"deleteOneGitOrganization","update":"updateOneGitOrganization","deleteMany":"deleteManyGitOrganization","updateMany":"updateManyGitOrganization","upsert":"upsertOneGitOrganization","aggregate":"aggregateGitOrganization","groupBy":"groupByGitOrganization"},{"model":"GitRepository","plural":"gitRepositories","findUnique":"findUniqueGitRepository","findFirst":"findFirstGitRepository","findMany":"findManyGitRepository","create":"createOneGitRepository","createMany":"createManyGitRepository","delete":"deleteOneGitRepository","update":"updateOneGitRepository","deleteMany":"deleteManyGitRepository","updateMany":"updateManyGitRepository","upsert":"upsertOneGitRepository","aggregate":"aggregateGitRepository","groupBy":"groupByGitRepository"},{"model":"User","plural":"users","findUnique":"findUniqueUser","findFirst":"findFirstUser","findMany":"findManyUser","create":"createOneUser","createMany":"createManyUser","delete":"deleteOneUser","update":"updateOneUser","deleteMany":"deleteManyUser","updateMany":"updateManyUser","upsert":"upsertOneUser","aggregate":"aggregateUser","groupBy":"groupByUser"},{"model":"UserRole","plural":"userRoles","findUnique":"findUniqueUserRole","findFirst":"findFirstUserRole","findMany":"findManyUserRole","create":"createOneUserRole","createMany":"createManyUserRole","delete":"deleteOneUserRole","update":"updateOneUserRole","deleteMany":"deleteManyUserRole","updateMany":"updateManyUserRole","upsert":"upsertOneUserRole","aggregate":"aggregateUserRole","groupBy":"groupByUserRole"},{"model":"ApiToken","plural":"apiTokens","findUnique":"findUniqueApiToken","findFirst":"findFirstApiToken","findMany":"findManyApiToken","create":"createOneApiToken","createMany":"createManyApiToken","delete":"deleteOneApiToken","update":"updateOneApiToken","deleteMany":"deleteManyApiToken","updateMany":"updateManyApiToken","upsert":"upsertOneApiToken","aggregate":"aggregateApiToken","groupBy":"groupByApiToken"},{"model":"Resource","plural":"resources","findUnique":"findUniqueResource","findFirst":"findFirstResource","findMany":"findManyResource","create":"createOneResource","createMany":"createManyResource","delete":"deleteOneResource","update":"updateOneResource","deleteMany":"deleteManyResource","updateMany":"updateManyResource","upsert":"upsertOneResource","aggregate":"aggregateResource","groupBy":"groupByResource"},{"model":"ResourceRole","plural":"resourceRoles","findUnique":"findUniqueResourceRole","findFirst":"findFirstResourceRole","findMany":"findManyResourceRole","create":"createOneResourceRole","createMany":"createManyResourceRole","delete":"deleteOneResourceRole","update":"updateOneResourceRole","deleteMany":"deleteManyResourceRole","updateMany":"updateManyResourceRole","upsert":"upsertOneResourceRole","aggregate":"aggregateResourceRole","groupBy":"groupByResourceRole"},{"model":"Commit","plural":"commits","findUnique":"findUniqueCommit","findFirst":"findFirstCommit","findMany":"findManyCommit","create":"createOneCommit","createMany":"createManyCommit","delete":"deleteOneCommit","update":"updateOneCommit","deleteMany":"deleteManyCommit","updateMany":"updateManyCommit","upsert":"upsertOneCommit","aggregate":"aggregateCommit","groupBy":"groupByCommit"},{"model":"Entity","plural":"entities","findUnique":"findUniqueEntity","findFirst":"findFirstEntity","findMany":"findManyEntity","create":"createOneEntity","createMany":"createManyEntity","delete":"deleteOneEntity","update":"updateOneEntity","deleteMany":"deleteManyEntity","updateMany":"updateManyEntity","upsert":"upsertOneEntity","aggregate":"aggregateEntity","groupBy":"groupByEntity"},{"model":"EntityVersion","plural":"entityVersions","findUnique":"findUniqueEntityVersion","findFirst":"findFirstEntityVersion","findMany":"findManyEntityVersion","create":"createOneEntityVersion","createMany":"createManyEntityVersion","delete":"deleteOneEntityVersion","update":"updateOneEntityVersion","deleteMany":"deleteManyEntityVersion","updateMany":"updateManyEntityVersion","upsert":"upsertOneEntityVersion","aggregate":"aggregateEntityVersion","groupBy":"groupByEntityVersion"},{"model":"EntityPermission","plural":"entityPermissions","findUnique":"findUniqueEntityPermission","findFirst":"findFirstEntityPermission","findMany":"findManyEntityPermission","create":"createOneEntityPermission","createMany":"createManyEntityPermission","delete":"deleteOneEntityPermission","update":"updateOneEntityPermission","deleteMany":"deleteManyEntityPermission","updateMany":"updateManyEntityPermission","upsert":"upsertOneEntityPermission","aggregate":"aggregateEntityPermission","groupBy":"groupByEntityPermission"},{"model":"EntityPermissionRole","plural":"entityPermissionRoles","findUnique":"findUniqueEntityPermissionRole","findFirst":"findFirstEntityPermissionRole","findMany":"findManyEntityPermissionRole","create":"createOneEntityPermissionRole","createMany":"createManyEntityPermissionRole","delete":"deleteOneEntityPermissionRole","update":"updateOneEntityPermissionRole","deleteMany":"deleteManyEntityPermissionRole","updateMany":"updateManyEntityPermissionRole","upsert":"upsertOneEntityPermissionRole","aggregate":"aggregateEntityPermissionRole","groupBy":"groupByEntityPermissionRole"},{"model":"EntityPermissionField","plural":"entityPermissionFields","findUnique":"findUniqueEntityPermissionField","findFirst":"findFirstEntityPermissionField","findMany":"findManyEntityPermissionField","create":"createOneEntityPermissionField","createMany":"createManyEntityPermissionField","delete":"deleteOneEntityPermissionField","update":"updateOneEntityPermissionField","deleteMany":"deleteManyEntityPermissionField","updateMany":"updateManyEntityPermissionField","upsert":"upsertOneEntityPermissionField","aggregate":"aggregateEntityPermissionField","groupBy":"groupByEntityPermissionField"},{"model":"EntityField","plural":"entityFields","findUnique":"findUniqueEntityField","findFirst":"findFirstEntityField","findMany":"findManyEntityField","create":"createOneEntityField","createMany":"createManyEntityField","delete":"deleteOneEntityField","update":"updateOneEntityField","deleteMany":"deleteManyEntityField","updateMany":"updateManyEntityField","upsert":"upsertOneEntityField","aggregate":"aggregateEntityField","groupBy":"groupByEntityField"},{"model":"Block","plural":"blocks","findUnique":"findUniqueBlock","findFirst":"findFirstBlock","findMany":"findManyBlock","create":"createOneBlock","createMany":"createManyBlock","delete":"deleteOneBlock","update":"updateOneBlock","deleteMany":"deleteManyBlock","updateMany":"updateManyBlock","upsert":"upsertOneBlock","aggregate":"aggregateBlock","groupBy":"groupByBlock"},{"model":"BlockVersion","plural":"blockVersions","findUnique":"findUniqueBlockVersion","findFirst":"findFirstBlockVersion","findMany":"findManyBlockVersion","create":"createOneBlockVersion","createMany":"createManyBlockVersion","delete":"deleteOneBlockVersion","update":"updateOneBlockVersion","deleteMany":"deleteManyBlockVersion","updateMany":"updateManyBlockVersion","upsert":"upsertOneBlockVersion","aggregate":"aggregateBlockVersion","groupBy":"groupByBlockVersion"},{"model":"Action","plural":"actions","findUnique":"findUniqueAction","findFirst":"findFirstAction","findMany":"findManyAction","create":"createOneAction","createMany":"createManyAction","delete":"deleteOneAction","update":"updateOneAction","deleteMany":"deleteManyAction","updateMany":"updateManyAction","upsert":"upsertOneAction","aggregate":"aggregateAction","groupBy":"groupByAction"},{"model":"ActionStep","plural":"actionSteps","findUnique":"findUniqueActionStep","findFirst":"findFirstActionStep","findMany":"findManyActionStep","create":"createOneActionStep","createMany":"createManyActionStep","delete":"deleteOneActionStep","update":"updateOneActionStep","deleteMany":"deleteManyActionStep","updateMany":"updateManyActionStep","upsert":"upsertOneActionStep","aggregate":"aggregateActionStep","groupBy":"groupByActionStep"},{"model":"ActionLog","plural":"actionLogs","findUnique":"findUniqueActionLog","findFirst":"findFirstActionLog","findMany":"findManyActionLog","create":"createOneActionLog","createMany":"createManyActionLog","delete":"deleteOneActionLog","update":"updateOneActionLog","deleteMany":"deleteManyActionLog","updateMany":"updateManyActionLog","upsert":"upsertOneActionLog","aggregate":"aggregateActionLog","groupBy":"groupByActionLog"},{"model":"Build","plural":"builds","findUnique":"findUniqueBuild","findFirst":"findFirstBuild","findMany":"findManyBuild","create":"createOneBuild","createMany":"createManyBuild","delete":"deleteOneBuild","update":"updateOneBuild","deleteMany":"deleteManyBuild","updateMany":"updateManyBuild","upsert":"upsertOneBuild","aggregate":"aggregateBuild","groupBy":"groupByBuild"},{"model":"Release","plural":"releases","findUnique":"findUniqueRelease","findFirst":"findFirstRelease","findMany":"findManyRelease","create":"createOneRelease","createMany":"createManyRelease","delete":"deleteOneRelease","update":"updateOneRelease","deleteMany":"deleteManyRelease","updateMany":"updateManyRelease","upsert":"upsertOneRelease","aggregate":"aggregateRelease","groupBy":"groupByRelease"},{"model":"Environment","plural":"environments","findUnique":"findUniqueEnvironment","findFirst":"findFirstEnvironment","findMany":"findManyEnvironment","create":"createOneEnvironment","createMany":"createManyEnvironment","delete":"deleteOneEnvironment","update":"updateOneEnvironment","deleteMany":"deleteManyEnvironment","updateMany":"updateManyEnvironment","upsert":"upsertOneEnvironment","aggregate":"aggregateEnvironment","groupBy":"groupByEnvironment"},{"model":"Deployment","plural":"deployments","findUnique":"findUniqueDeployment","findFirst":"findFirstDeployment","findMany":"findManyDeployment","create":"createOneDeployment","createMany":"createManyDeployment","delete":"deleteOneDeployment","update":"updateOneDeployment","deleteMany":"deleteManyDeployment","updateMany":"updateManyDeployment","upsert":"upsertOneDeployment","aggregate":"aggregateDeployment","groupBy":"groupByDeployment"},{"model":"Invitation","plural":"invitations","findUnique":"findUniqueInvitation","findFirst":"findFirstInvitation","findMany":"findManyInvitation","create":"createOneInvitation","createMany":"createManyInvitation","delete":"deleteOneInvitation","update":"updateOneInvitation","deleteMany":"deleteManyInvitation","updateMany":"updateManyInvitation","upsert":"upsertOneInvitation","aggregate":"aggregateInvitation","groupBy":"groupByInvitation"},{"model":"Subscription","plural":"subscriptions","findUnique":"findUniqueSubscription","findFirst":"findFirstSubscription","findMany":"findManySubscription","create":"createOneSubscription","createMany":"createManySubscription","delete":"deleteOneSubscription","update":"updateOneSubscription","deleteMany":"deleteManySubscription","updateMany":"updateManySubscription","upsert":"upsertOneSubscription","aggregate":"aggregateSubscription","groupBy":"groupBySubscription"}],"otherOperations":{"read":[],"write":["executeRaw","queryRaw"]}}}';
const dmmf = JSON.parse(dmmfString);
exports.Prisma.dmmf = JSON.parse(dmmfString);

/**
 * Create the Client
 */
const config = {
  generator: {
    name: "client",
    provider: {
      fromEnvVar: null,
      value: "prisma-client-js",
    },
    output: {
      value:
        "/Users/arielweinberger/Development/amplication/amplication/packages/amplication-server/prisma/generated-prisma-client",
      fromEnvVar: null,
    },
    config: {
      engineType: "library",
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: "darwin-arm64",
      },
      {
        fromEnvVar: null,
        value: "debian-openssl-1.1.x",
      },
      {
        fromEnvVar: null,
        value: "linux-arm64-openssl-1.1.x",
      },
    ],
    previewFeatures: [],
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
    schemaEnvPath: "../../../amplication-prisma-db/.env",
  },
  relativePath: "../../../amplication-prisma-db/prisma",
  clientVersion: "4.6.1",
  engineVersion: "694eea289a8462c80264df36757e4fdc129b1b32",
  datasourceNames: ["db"],
  activeProvider: "postgresql",
  dataProxy: false,
};
config.document = dmmf;
config.dirname = dirname;

const { warnEnvConflicts } = require("./runtime/index");

warnEnvConflicts({
  rootEnvPath:
    config.relativeEnvPaths.rootEnvPath &&
    path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath:
    config.relativeEnvPaths.schemaEnvPath &&
    path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath),
});

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);

path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
path.join(
  process.cwd(),
  "../amplication-server/prisma/generated-prisma-client/libquery_engine-darwin-arm64.dylib.node"
);

path.join(__dirname, "libquery_engine-debian-openssl-1.1.x.so.node");
path.join(
  process.cwd(),
  "../amplication-server/prisma/generated-prisma-client/libquery_engine-debian-openssl-1.1.x.so.node"
);

path.join(__dirname, "libquery_engine-linux-arm64-openssl-1.1.x.so.node");
path.join(
  process.cwd(),
  "../amplication-server/prisma/generated-prisma-client/libquery_engine-linux-arm64-openssl-1.1.x.so.node"
);
path.join(__dirname, "schema.prisma");
path.join(
  process.cwd(),
  "../amplication-server/prisma/generated-prisma-client/schema.prisma"
);
