Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
} = require("./runtime/index-browser");

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

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
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

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`
    );
  }
}
exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
