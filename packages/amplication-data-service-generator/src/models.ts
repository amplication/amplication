export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Account = {
  __typename?: "Account";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
  githubId?: Maybe<Scalars["String"]>;
};

export type Action = {
  __typename?: "Action";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  steps?: Maybe<Array<ActionStep>>;
};

export type ActionLog = {
  __typename?: "ActionLog";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  message: Scalars["String"];
  meta: Scalars["JSONObject"];
  level: EnumActionLogLevel;
};

export type ActionStep = {
  __typename?: "ActionStep";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  name: Scalars["String"];
  message: Scalars["String"];
  status: EnumActionStepStatus;
  completedAt?: Maybe<Scalars["DateTime"]>;
  logs?: Maybe<Array<ActionLog>>;
};

export type ApiToken = {
  __typename?: "ApiToken";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  userId: Scalars["String"];
  token?: Maybe<Scalars["String"]>;
  previewChars: Scalars["String"];
  lastAccessAt: Scalars["DateTime"];
};

export type ApiTokenCreateInput = {
  name: Scalars["String"];
};

export type App = {
  __typename?: "App";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  description: Scalars["String"];
  color: Scalars["String"];
  entities: Array<Entity>;
  environments: Array<Environment>;
  builds: Array<Build>;
  githubTokenCreatedDate?: Maybe<Scalars["DateTime"]>;
  githubSyncEnabled: Scalars["Boolean"];
  githubRepo?: Maybe<Scalars["String"]>;
  githubBranch?: Maybe<Scalars["String"]>;
  githubLastSync?: Maybe<Scalars["DateTime"]>;
  githubLastMessage?: Maybe<Scalars["String"]>;
};

export type AppEntitiesArgs = {
  where?: Maybe<EntityWhereInput>;
  orderBy?: Maybe<EntityOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type AppBuildsArgs = {
  where?: Maybe<BuildWhereInput>;
  orderBy?: Maybe<BuildOrderByInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type AppCreateInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  color?: Maybe<Scalars["String"]>;
};

export type AppCreateWithEntitiesEntityInput = {
  name: Scalars["String"];
  fields: Array<AppCreateWithEntitiesFieldInput>;
  relationsToEntityIndex?: Maybe<Array<Scalars["Int"]>>;
};

export type AppCreateWithEntitiesFieldInput = {
  name: Scalars["String"];
  dataType?: Maybe<EnumDataType>;
};

export type AppCreateWithEntitiesInput = {
  app: AppCreateInput;
  entities: Array<AppCreateWithEntitiesEntityInput>;
  commitMessage: Scalars["String"];
};

export type AppEnableSyncWithGithubRepoInput = {
  /** The full name of the repo in the format org-name/repo-name */
  githubRepo: Scalars["String"];
  /** optional: defaults to default branch */
  githubBranch?: Maybe<Scalars["String"]>;
};

export type AppOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type AppRole = {
  __typename?: "AppRole";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
};

export type AppRoleCreateInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  app: WhereParentIdInput;
};

export type AppRoleOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type AppRoleUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
};

export type AppRoleWhereInput = {
  id?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  displayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
  app?: Maybe<WhereUniqueInput>;
};

export type AppUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  color?: Maybe<Scalars["String"]>;
};

export enum AppValidationErrorTypes {
  CannotMergeCodeToGitHubBreakingChanges = "CannotMergeCodeToGitHubBreakingChanges",
  CannotMergeCodeToGitHubInvalidAppId = "CannotMergeCodeToGitHubInvalidAppId",
  DataServiceGeneratorVersionMissing = "DataServiceGeneratorVersionMissing",
  DataServiceGeneratorVersionInvalid = "DataServiceGeneratorVersionInvalid",
}

export type AppValidationResult = {
  __typename?: "AppValidationResult";
  isValid: Scalars["Boolean"];
  messages: Array<AppValidationErrorTypes>;
};

export type AppWhereInput = {
  id?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
};

export type Auth = {
  __typename?: "Auth";
  /** JWT Bearer token */
  token: Scalars["String"];
};

export type AuthorizeAppWithGithubResult = {
  __typename?: "AuthorizeAppWithGithubResult";
  url: Scalars["String"];
};

export type AvailableGithubReposFindInput = {
  app: WhereUniqueInput;
};

export type Block = {
  __typename?: "Block";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  app?: Maybe<App>;
  parentBlock?: Maybe<Block>;
  displayName: Scalars["String"];
  description: Scalars["String"];
  blockType: EnumBlockType;
  versionNumber?: Maybe<Scalars["Float"]>;
};

export type BlockInputOutput = {
  __typename?: "BlockInputOutput";
  name: Scalars["String"];
  description: Scalars["String"];
  dataType?: Maybe<EnumDataType>;
  dataTypeEntityName?: Maybe<Scalars["String"]>;
  isList?: Maybe<Scalars["Boolean"]>;
  includeAllPropertiesByDefault?: Maybe<Scalars["Boolean"]>;
  propertyList?: Maybe<Array<PropertySelector>>;
};

export type BlockInputOutputInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  dataType?: Maybe<EnumDataType>;
  dataTypeEntityName?: Maybe<Scalars["String"]>;
  isList?: Maybe<Scalars["Boolean"]>;
  includeAllPropertiesByDefault?: Maybe<Scalars["Boolean"]>;
  propertyList?: Maybe<Array<PropertySelectorInput>>;
};

export type BlockOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  blockType?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type BlockUpdateInput = {
  displayName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type BlockVersion = {
  __typename?: "BlockVersion";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  block: Block;
  versionNumber: Scalars["Int"];
  label: Scalars["String"];
};

export type BlockVersionCreateInput = {
  label: Scalars["String"];
  block: WhereParentIdInput;
};

export type BlockVersionOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  versionNumber?: Maybe<SortOrder>;
  label?: Maybe<SortOrder>;
};

export type BlockVersionWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  versionNumber?: Maybe<IntFilter>;
  label?: Maybe<StringFilter>;
  block?: Maybe<WhereUniqueInput>;
};

export type BlockWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  app?: Maybe<WhereUniqueInput>;
  parentBlock?: Maybe<WhereUniqueInput>;
  blockType?: Maybe<EnumBlockTypeFilter>;
  displayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
};

export type BooleanFilter = {
  equals?: Maybe<Scalars["Boolean"]>;
  not?: Maybe<Scalars["Boolean"]>;
};

export type Build = {
  __typename?: "Build";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  app: App;
  appId: Scalars["String"];
  createdBy: User;
  userId: Scalars["String"];
  status?: Maybe<EnumBuildStatus>;
  archiveURI: Scalars["String"];
  version: Scalars["String"];
  message: Scalars["String"];
  actionId: Scalars["String"];
  action?: Maybe<Action>;
  deployments?: Maybe<Array<Deployment>>;
  commit: Commit;
  commitId: Scalars["String"];
};

export type BuildDeploymentsArgs = {
  where?: Maybe<DeploymentWhereInput>;
  orderBy?: Maybe<DeploymentOrderByInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type BuildCreateInput = {
  app: WhereParentIdInput;
  message: Scalars["String"];
  commit: WhereParentIdInput;
};

export type BuildOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  userId?: Maybe<SortOrder>;
  status?: Maybe<SortOrder>;
  version?: Maybe<SortOrder>;
  message?: Maybe<SortOrder>;
};

export type BuildWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  app: WhereUniqueInput;
  createdBy?: Maybe<WhereUniqueInput>;
  version?: Maybe<StringFilter>;
  message?: Maybe<StringFilter>;
  commit?: Maybe<WhereUniqueInput>;
};

export type ChangePasswordInput = {
  oldPassword: Scalars["String"];
  newPassword: Scalars["String"];
};

export type Commit = {
  __typename?: "Commit";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  userId: Scalars["String"];
  user?: Maybe<User>;
  message: Scalars["String"];
  builds?: Maybe<Array<Build>>;
  changes?: Maybe<Array<PendingChange>>;
};

export type CommitBuildsArgs = {
  where?: Maybe<BuildWhereInput>;
  orderBy?: Maybe<BuildOrderByInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type CommitCreateInput = {
  message: Scalars["String"];
  app: WhereParentIdInput;
};

export type CommitOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  message?: Maybe<SortOrder>;
};

export type CommitWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  app: WhereUniqueInput;
  user?: Maybe<WhereUniqueInput>;
  message?: Maybe<StringFilter>;
};

export type CommitWhereUniqueInput = {
  id?: Maybe<Scalars["String"]>;
};

export type CompleteAuthorizeAppWithGithubInput = {
  code: Scalars["String"];
  state: Scalars["String"];
};

export type ConnectorRestApi = IBlock & {
  __typename?: "ConnectorRestApi";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  parentBlock?: Maybe<Block>;
  displayName: Scalars["String"];
  description: Scalars["String"];
  blockType: EnumBlockType;
  versionNumber: Scalars["Float"];
  inputParameters: Array<BlockInputOutput>;
  outputParameters: Array<BlockInputOutput>;
  authenticationType: EnumConnectorRestApiAuthenticationType;
  privateKeyAuthenticationSettings?: Maybe<PrivateKeyAuthenticationSettings>;
  httpBasicAuthenticationSettings?: Maybe<HttpBasicAuthenticationSettings>;
};

export type ConnectorRestApiCall = IBlock & {
  __typename?: "ConnectorRestApiCall";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  parentBlock?: Maybe<Block>;
  displayName: Scalars["String"];
  description: Scalars["String"];
  blockType: EnumBlockType;
  versionNumber: Scalars["Float"];
  inputParameters: Array<BlockInputOutput>;
  outputParameters: Array<BlockInputOutput>;
  url: Scalars["String"];
};

export type ConnectorRestApiCallCreateInput = {
  displayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  app: WhereParentIdInput;
  parentBlock?: Maybe<WhereParentIdInput>;
  inputParameters?: Maybe<Array<BlockInputOutputInput>>;
  outputParameters?: Maybe<Array<BlockInputOutputInput>>;
  url: Scalars["String"];
};

export type ConnectorRestApiCallOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  blockType?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type ConnectorRestApiCallWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  app?: Maybe<WhereUniqueInput>;
  parentBlock?: Maybe<WhereUniqueInput>;
  displayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
};

export type ConnectorRestApiCreateInput = {
  displayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  app: WhereParentIdInput;
  parentBlock?: Maybe<WhereParentIdInput>;
  inputParameters?: Maybe<Array<BlockInputOutputInput>>;
  outputParameters?: Maybe<Array<BlockInputOutputInput>>;
  authenticationType: EnumConnectorRestApiAuthenticationType;
  privateKeyAuthenticationSettings?: Maybe<
    PrivateKeyAuthenticationSettingsInput
  >;
  httpBasicAuthenticationSettings?: Maybe<HttpBasicAuthenticationSettingsInput>;
};

export type ConnectorRestApiOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  blockType?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type ConnectorRestApiWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  app?: Maybe<WhereUniqueInput>;
  parentBlock?: Maybe<WhereUniqueInput>;
  displayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
};

export type DateTimeFilter = {
  equals?: Maybe<Scalars["DateTime"]>;
  not?: Maybe<Scalars["DateTime"]>;
  in?: Maybe<Array<Scalars["DateTime"]>>;
  notIn?: Maybe<Array<Scalars["DateTime"]>>;
  lt?: Maybe<Scalars["DateTime"]>;
  lte?: Maybe<Scalars["DateTime"]>;
  gt?: Maybe<Scalars["DateTime"]>;
  gte?: Maybe<Scalars["DateTime"]>;
};

export type Deployment = {
  __typename?: "Deployment";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  createdBy: User;
  userId: Scalars["String"];
  build: Build;
  buildId: Scalars["String"];
  environment: Environment;
  environmentId: Scalars["String"];
  status: EnumDeploymentStatus;
  message: Scalars["String"];
  actionId: Scalars["String"];
  action?: Maybe<Action>;
};

export type DeploymentCreateInput = {
  build: WhereParentIdInput;
  environment: WhereParentIdInput;
  message?: Maybe<Scalars["String"]>;
};

export type DeploymentOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  userId?: Maybe<SortOrder>;
  status?: Maybe<SortOrder>;
  message?: Maybe<SortOrder>;
};

export type DeploymentWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  build: WhereUniqueInput;
  environment: WhereUniqueInput;
  status?: Maybe<EnumDeploymentStatusFilter>;
  createdBy?: Maybe<WhereUniqueInput>;
  message?: Maybe<StringFilter>;
};

export type Entity = {
  __typename?: "Entity";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  app?: Maybe<App>;
  appId: Scalars["String"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  versions?: Maybe<Array<EntityVersion>>;
  fields?: Maybe<Array<EntityField>>;
  permissions?: Maybe<Array<EntityPermission>>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  lockedByUser?: Maybe<User>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
};

export type EntityVersionsArgs = {
  where?: Maybe<EntityVersionWhereInput>;
  orderBy?: Maybe<EntityVersionOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type EntityFieldsArgs = {
  where?: Maybe<EntityFieldWhereInput>;
  orderBy?: Maybe<EntityFieldOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type EntityAddPermissionFieldInput = {
  action: EnumEntityAction;
  fieldName: Scalars["String"];
  entity: WhereParentIdInput;
};

export type EntityCreateInput = {
  name: Scalars["String"];
  displayName: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  app: WhereParentIdInput;
};

export type EntityField = {
  __typename?: "EntityField";
  id: Scalars["String"];
  permanentId: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  dataType: EnumDataType;
  properties?: Maybe<Scalars["JSONObject"]>;
  required: Scalars["Boolean"];
  searchable: Scalars["Boolean"];
  description?: Maybe<Scalars["String"]>;
  position?: Maybe<Scalars["Int"]>;
};

export type EntityFieldCreateByDisplayNameInput = {
  displayName: Scalars["String"];
  dataType?: Maybe<EnumDataType>;
  entity: WhereParentIdInput;
};

export type EntityFieldCreateInput = {
  name: Scalars["String"];
  displayName: Scalars["String"];
  dataType: EnumDataType;
  properties: Scalars["JSONObject"];
  required: Scalars["Boolean"];
  searchable: Scalars["Boolean"];
  description: Scalars["String"];
  entity: WhereParentIdInput;
  position?: Maybe<Scalars["Int"]>;
};

export type EntityFieldFilter = {
  every?: Maybe<EntityFieldWhereInput>;
  some?: Maybe<EntityFieldWhereInput>;
  none?: Maybe<EntityFieldWhereInput>;
};

export type EntityFieldOrderByInput = {
  id?: Maybe<SortOrder>;
  permanentId?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  dataType?: Maybe<SortOrder>;
  required?: Maybe<SortOrder>;
  searchable?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
  position?: Maybe<SortOrder>;
};

export type EntityFieldUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  dataType?: Maybe<EnumDataType>;
  properties?: Maybe<Scalars["JSONObject"]>;
  required?: Maybe<Scalars["Boolean"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  position?: Maybe<Scalars["Int"]>;
};

export type EntityFieldWhereInput = {
  id?: Maybe<StringFilter>;
  permanentId?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  displayName?: Maybe<StringFilter>;
  dataType?: Maybe<EnumDataTypeFilter>;
  required?: Maybe<BooleanFilter>;
  searchable?: Maybe<BooleanFilter>;
  description?: Maybe<StringFilter>;
};

export type EntityOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  pluralDisplayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type EntityPage = IBlock & {
  __typename?: "EntityPage";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  parentBlock?: Maybe<Block>;
  displayName: Scalars["String"];
  description: Scalars["String"];
  blockType: EnumBlockType;
  versionNumber: Scalars["Float"];
  inputParameters: Array<BlockInputOutput>;
  outputParameters: Array<BlockInputOutput>;
  entityId: Scalars["String"];
  pageType: EnumEntityPageType;
  singleRecordSettings?: Maybe<EntityPageSingleRecordSettings>;
  listSettings?: Maybe<EntityPageListSettings>;
  showAllFields: Scalars["Boolean"];
  showFieldList?: Maybe<Array<Scalars["String"]>>;
};

export type EntityPageCreateInput = {
  displayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  app: WhereParentIdInput;
  parentBlock?: Maybe<WhereParentIdInput>;
  inputParameters?: Maybe<Array<BlockInputOutputInput>>;
  outputParameters?: Maybe<Array<BlockInputOutputInput>>;
  entityId?: Maybe<Scalars["String"]>;
  pageType: EnumEntityPageType;
  singleRecordSettings?: Maybe<EntityPageSingleRecordSettingsInput>;
  listSettings?: Maybe<EntityPageListSettingsInput>;
  showAllFields: Scalars["Boolean"];
  showFieldList?: Maybe<Array<Scalars["String"]>>;
};

export type EntityPageListSettings = IEntityPageSettings & {
  __typename?: "EntityPageListSettings";
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
  enableSearch: Scalars["Boolean"];
  navigateToPageId?: Maybe<Scalars["String"]>;
};

export type EntityPageListSettingsInput = {
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
  enableSearch: Scalars["Boolean"];
  navigateToPageId?: Maybe<Scalars["String"]>;
};

export type EntityPageOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  blockType?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type EntityPageSingleRecordSettings = IEntityPageSettings & {
  __typename?: "EntityPageSingleRecordSettings";
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
  allowUpdate: Scalars["Boolean"];
};

export type EntityPageSingleRecordSettingsInput = {
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
  allowUpdate: Scalars["Boolean"];
};

export type EntityPageUpdateInput = {
  displayName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  entityId?: Maybe<Scalars["String"]>;
  pageType: EnumEntityPageType;
  singleRecordSettings?: Maybe<EntityPageSingleRecordSettingsInput>;
  listSettings?: Maybe<EntityPageListSettingsInput>;
  showAllFields: Scalars["Boolean"];
  showFieldList?: Maybe<Array<Scalars["String"]>>;
};

export type EntityPageWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  app?: Maybe<WhereUniqueInput>;
  parentBlock?: Maybe<WhereUniqueInput>;
  displayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
};

export type EntityPermission = {
  __typename?: "EntityPermission";
  id: Scalars["String"];
  entityVersionId: Scalars["String"];
  entityVersion?: Maybe<EntityVersion>;
  action: EnumEntityAction;
  type: EnumEntityPermissionType;
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
  permissionFields?: Maybe<Array<EntityPermissionField>>;
};

export type EntityPermissionField = {
  __typename?: "EntityPermissionField";
  id: Scalars["String"];
  permissionId: Scalars["String"];
  permission?: Maybe<EntityPermission>;
  fieldPermanentId: Scalars["String"];
  entityVersionId: Scalars["String"];
  field: EntityField;
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
};

export type EntityPermissionFieldWhereUniqueInput = {
  entityId: Scalars["String"];
  action: EnumEntityAction;
  fieldPermanentId: Scalars["String"];
};

export type EntityPermissionRole = {
  __typename?: "EntityPermissionRole";
  id: Scalars["String"];
  entityVersionId: Scalars["String"];
  action: EnumEntityAction;
  entityPermission?: Maybe<EntityPermission>;
  appRoleId: Scalars["String"];
  appRole: AppRole;
};

export type EntityUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  pluralDisplayName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type EntityUpdatePermissionFieldRolesInput = {
  permissionField: WhereParentIdInput;
  deletePermissionRoles?: Maybe<Array<WhereUniqueInput>>;
  addPermissionRoles?: Maybe<Array<WhereUniqueInput>>;
};

export type EntityUpdatePermissionInput = {
  action: EnumEntityAction;
  type: EnumEntityPermissionType;
};

export type EntityUpdatePermissionRolesInput = {
  action: EnumEntityAction;
  entity: WhereParentIdInput;
  deleteRoles?: Maybe<Array<WhereUniqueInput>>;
  addRoles?: Maybe<Array<WhereUniqueInput>>;
};

export type EntityVersion = {
  __typename?: "EntityVersion";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  entityId: Scalars["String"];
  entity: Entity;
  versionNumber: Scalars["Int"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  commit?: Maybe<Commit>;
  fields: Array<EntityField>;
  permissions?: Maybe<Array<EntityPermission>>;
};

export type EntityVersionFieldsArgs = {
  where?: Maybe<EntityFieldWhereInput>;
  orderBy?: Maybe<EntityFieldOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type EntityVersionOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  versionNumber?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  pluralDisplayName?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
  label?: Maybe<SortOrder>;
};

export type EntityVersionWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  versionNumber?: Maybe<IntFilter>;
  name?: Maybe<StringFilter>;
  displayName?: Maybe<StringFilter>;
  pluralDisplayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
  label?: Maybe<StringFilter>;
  entity?: Maybe<WhereUniqueInput>;
};

export type EntityWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  displayName?: Maybe<StringFilter>;
  pluralDisplayName?: Maybe<StringFilter>;
  description?: Maybe<StringFilter>;
  fields?: Maybe<EntityFieldFilter>;
  app?: Maybe<WhereUniqueInput>;
};

export enum EnumActionLogLevel {
  Error = "Error",
  Warning = "Warning",
  Info = "Info",
  Debug = "Debug",
}

export enum EnumActionStepStatus {
  Waiting = "Waiting",
  Running = "Running",
  Failed = "Failed",
  Success = "Success",
}

export enum EnumBlockType {
  AppSettings = "AppSettings",
  Flow = "Flow",
  ConnectorRestApi = "ConnectorRestApi",
  ConnectorRestApiCall = "ConnectorRestApiCall",
  ConnectorSoapApi = "ConnectorSoapApi",
  ConnectorFile = "ConnectorFile",
  EntityApi = "EntityApi",
  EntityApiEndpoint = "EntityApiEndpoint",
  FlowApi = "FlowApi",
  Layout = "Layout",
  CanvasPage = "CanvasPage",
  EntityPage = "EntityPage",
  Document = "Document",
}

export type EnumBlockTypeFilter = {
  equals?: Maybe<EnumBlockType>;
  not?: Maybe<EnumBlockType>;
  in?: Maybe<Array<EnumBlockType>>;
  notIn?: Maybe<Array<EnumBlockType>>;
};

export enum EnumBuildStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Invalid = "Invalid",
}

export enum EnumConnectorRestApiAuthenticationType {
  None = "None",
  PrivateKey = "PrivateKey",
  HttpBasicAuthentication = "HttpBasicAuthentication",
  OAuth2PasswordFlow = "OAuth2PasswordFlow",
  OAuth2UserAgentFlow = "OAuth2UserAgentFlow",
}

export enum EnumDataType {
  SingleLineText = "SingleLineText",
  MultiLineText = "MultiLineText",
  Email = "Email",
  WholeNumber = "WholeNumber",
  DateTime = "DateTime",
  DecimalNumber = "DecimalNumber",
  Lookup = "Lookup",
  MultiSelectOptionSet = "MultiSelectOptionSet",
  OptionSet = "OptionSet",
  Boolean = "Boolean",
  GeographicLocation = "GeographicLocation",
  Id = "Id",
  CreatedAt = "CreatedAt",
  UpdatedAt = "UpdatedAt",
  Roles = "Roles",
  Username = "Username",
  Password = "Password",
  Json = "Json",
}

export type EnumDataTypeFilter = {
  equals?: Maybe<EnumDataType>;
  not?: Maybe<EnumDataType>;
  in?: Maybe<Array<EnumDataType>>;
  notIn?: Maybe<Array<EnumDataType>>;
};

export enum EnumDeploymentStatus {
  Waiting = "Waiting",
  Completed = "Completed",
  Failed = "Failed",
  Removed = "Removed",
}

export type EnumDeploymentStatusFilter = {
  equals?: Maybe<EnumDeploymentStatus>;
  not?: Maybe<EnumDeploymentStatus>;
  in?: Maybe<Array<EnumDeploymentStatus>>;
  notIn?: Maybe<Array<EnumDeploymentStatus>>;
};

export enum EnumEntityAction {
  View = "View",
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
  Search = "Search",
}

export enum EnumEntityPageType {
  SingleRecord = "SingleRecord",
  List = "List",
  MasterDetails = "MasterDetails",
}

export enum EnumEntityPermissionType {
  AllRoles = "AllRoles",
  Granular = "Granular",
  Disabled = "Disabled",
}

export enum EnumPendingChangeAction {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
}

export enum EnumPendingChangeResourceType {
  Entity = "Entity",
  Block = "Block",
}

export type Environment = {
  __typename?: "Environment";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  app: App;
  appId: Scalars["String"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  address: Scalars["String"];
};

export type GithubRepo = {
  __typename?: "GithubRepo";
  name: Scalars["String"];
  url: Scalars["String"];
  private: Scalars["Boolean"];
  fullName: Scalars["String"];
  admin: Scalars["Boolean"];
};

export type HttpBasicAuthenticationSettings = {
  __typename?: "HttpBasicAuthenticationSettings";
  username: Scalars["String"];
  password: Scalars["String"];
};

export type HttpBasicAuthenticationSettingsInput = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type IBlock = {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  parentBlock?: Maybe<Block>;
  displayName: Scalars["String"];
  description: Scalars["String"];
  blockType: EnumBlockType;
  versionNumber: Scalars["Float"];
  inputParameters: Array<BlockInputOutput>;
  outputParameters: Array<BlockInputOutput>;
};

export type IEntityPageSettings = {
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
};

export type IntFilter = {
  equals?: Maybe<Scalars["Int"]>;
  not?: Maybe<Scalars["Int"]>;
  in?: Maybe<Array<Scalars["Int"]>>;
  notIn?: Maybe<Array<Scalars["Int"]>>;
  lt?: Maybe<Scalars["Int"]>;
  lte?: Maybe<Scalars["Int"]>;
  gt?: Maybe<Scalars["Int"]>;
  gte?: Maybe<Scalars["Int"]>;
};

export type InviteUserInput = {
  email: Scalars["String"];
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  updateAccount: Account;
  deleteWorkspace?: Maybe<Workspace>;
  updateWorkspace?: Maybe<Workspace>;
  createWorkspace?: Maybe<Workspace>;
  inviteUser?: Maybe<User>;
  createOneEntity: Entity;
  deleteEntity?: Maybe<Entity>;
  updateEntity?: Maybe<Entity>;
  lockEntity?: Maybe<Entity>;
  updateEntityPermission: EntityPermission;
  updateEntityPermissionRoles: EntityPermission;
  addEntityPermissionField: EntityPermissionField;
  deleteEntityPermissionField: EntityPermissionField;
  updateEntityPermissionFieldRoles: EntityPermissionField;
  createEntityField: EntityField;
  createEntityFieldByDisplayName: EntityField;
  deleteEntityField: EntityField;
  updateEntityField: EntityField;
  createDefaultRelatedField: EntityField;
  createAppRole: AppRole;
  deleteAppRole?: Maybe<AppRole>;
  updateAppRole?: Maybe<AppRole>;
  createBuild: Build;
  createDeployment: Deployment;
  createApp: App;
  createAppWithEntities: App;
  deleteApp?: Maybe<App>;
  updateApp?: Maybe<App>;
  commit?: Maybe<Commit>;
  discardPendingChanges?: Maybe<Scalars["Boolean"]>;
  startAuthorizeAppWithGithub: AuthorizeAppWithGithubResult;
  completeAuthorizeAppWithGithub: App;
  removeAuthorizeAppWithGithub: App;
  appEnableSyncWithGithubRepo: App;
  appDisableSyncWithGithubRepo: App;
  signup: Auth;
  login: Auth;
  createApiToken: ApiToken;
  changePassword: Account;
  deleteApiToken: ApiToken;
  setCurrentWorkspace: Auth;
  createConnectorRestApi: ConnectorRestApi;
  updateConnectorRestApi: ConnectorRestApi;
  createBlockVersion: Block;
  createConnectorRestApiCall: ConnectorRestApiCall;
  updateConnectorRestApiCall: ConnectorRestApiCall;
  createEntityPage: EntityPage;
  updateEntityPage: EntityPage;
};

export type MutationUpdateAccountArgs = {
  data: UpdateAccountInput;
};

export type MutationDeleteWorkspaceArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateWorkspaceArgs = {
  data: WorkspaceUpdateInput;
  where: WhereUniqueInput;
};

export type MutationCreateWorkspaceArgs = {
  data: WorkspaceCreateInput;
};

export type MutationInviteUserArgs = {
  data: InviteUserInput;
};

export type MutationCreateOneEntityArgs = {
  data: EntityCreateInput;
};

export type MutationDeleteEntityArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateEntityArgs = {
  data: EntityUpdateInput;
  where: WhereUniqueInput;
};

export type MutationLockEntityArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateEntityPermissionArgs = {
  data: EntityUpdatePermissionInput;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityPermissionRolesArgs = {
  data: EntityUpdatePermissionRolesInput;
};

export type MutationAddEntityPermissionFieldArgs = {
  data: EntityAddPermissionFieldInput;
};

export type MutationDeleteEntityPermissionFieldArgs = {
  where: EntityPermissionFieldWhereUniqueInput;
};

export type MutationUpdateEntityPermissionFieldRolesArgs = {
  data: EntityUpdatePermissionFieldRolesInput;
};

export type MutationCreateEntityFieldArgs = {
  data: EntityFieldCreateInput;
  relatedFieldName?: Maybe<Scalars["String"]>;
  relatedFieldDisplayName?: Maybe<Scalars["String"]>;
};

export type MutationCreateEntityFieldByDisplayNameArgs = {
  data: EntityFieldCreateByDisplayNameInput;
};

export type MutationDeleteEntityFieldArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateEntityFieldArgs = {
  data: EntityFieldUpdateInput;
  where: WhereUniqueInput;
  relatedFieldName?: Maybe<Scalars["String"]>;
  relatedFieldDisplayName?: Maybe<Scalars["String"]>;
};

export type MutationCreateDefaultRelatedFieldArgs = {
  where: WhereUniqueInput;
  relatedFieldName?: Maybe<Scalars["String"]>;
  relatedFieldDisplayName?: Maybe<Scalars["String"]>;
};

export type MutationCreateAppRoleArgs = {
  data: AppRoleCreateInput;
};

export type MutationDeleteAppRoleArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateAppRoleArgs = {
  data: AppRoleUpdateInput;
  where: WhereUniqueInput;
};

export type MutationCreateBuildArgs = {
  data: BuildCreateInput;
};

export type MutationCreateDeploymentArgs = {
  data: DeploymentCreateInput;
};

export type MutationCreateAppArgs = {
  data: AppCreateInput;
};

export type MutationCreateAppWithEntitiesArgs = {
  data: AppCreateWithEntitiesInput;
};

export type MutationDeleteAppArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateAppArgs = {
  data: AppUpdateInput;
  where: WhereUniqueInput;
};

export type MutationCommitArgs = {
  data: CommitCreateInput;
};

export type MutationDiscardPendingChangesArgs = {
  data: PendingChangesDiscardInput;
};

export type MutationStartAuthorizeAppWithGithubArgs = {
  where: WhereUniqueInput;
};

export type MutationCompleteAuthorizeAppWithGithubArgs = {
  data: CompleteAuthorizeAppWithGithubInput;
  where: WhereUniqueInput;
};

export type MutationRemoveAuthorizeAppWithGithubArgs = {
  where: WhereUniqueInput;
};

export type MutationAppEnableSyncWithGithubRepoArgs = {
  data: AppEnableSyncWithGithubRepoInput;
  where: WhereUniqueInput;
};

export type MutationAppDisableSyncWithGithubRepoArgs = {
  where: WhereUniqueInput;
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationCreateApiTokenArgs = {
  data: ApiTokenCreateInput;
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationDeleteApiTokenArgs = {
  where: WhereUniqueInput;
};

export type MutationSetCurrentWorkspaceArgs = {
  data: WhereUniqueInput;
};

export type MutationCreateConnectorRestApiArgs = {
  data: ConnectorRestApiCreateInput;
};

export type MutationUpdateConnectorRestApiArgs = {
  data: BlockUpdateInput;
  where: WhereUniqueInput;
};

export type MutationCreateBlockVersionArgs = {
  data: BlockVersionCreateInput;
};

export type MutationCreateConnectorRestApiCallArgs = {
  data: ConnectorRestApiCallCreateInput;
};

export type MutationUpdateConnectorRestApiCallArgs = {
  data: BlockUpdateInput;
  where: WhereUniqueInput;
};

export type MutationCreateEntityPageArgs = {
  data: EntityPageCreateInput;
};

export type MutationUpdateEntityPageArgs = {
  data: EntityPageUpdateInput;
  where: WhereUniqueInput;
};

export type PendingChange = {
  __typename?: "PendingChange";
  action: EnumPendingChangeAction;
  resourceType: EnumPendingChangeResourceType;
  resourceId: Scalars["String"];
  resource: PendingChangeResource;
  versionNumber: Scalars["Int"];
};

export type PendingChangeResource = Entity | Block;

export type PendingChangesDiscardInput = {
  app: WhereParentIdInput;
};

export type PendingChangesFindInput = {
  app: WhereUniqueInput;
};

export type PrivateKeyAuthenticationSettings = {
  __typename?: "PrivateKeyAuthenticationSettings";
  keyName: Scalars["String"];
  keyValue: Scalars["String"];
  type: Scalars["String"];
};

export type PrivateKeyAuthenticationSettingsInput = {
  keyName: Scalars["String"];
  keyValue: Scalars["String"];
  type: Scalars["String"];
};

export type PropertySelector = {
  __typename?: "PropertySelector";
  propertyName: Scalars["String"];
  include: Scalars["Boolean"];
};

export type PropertySelectorInput = {
  propertyName: Scalars["String"];
  include: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  account: Account;
  workspaces: Array<Workspace>;
  workspace?: Maybe<Workspace>;
  currentWorkspace?: Maybe<Workspace>;
  entity?: Maybe<Entity>;
  entities: Array<Entity>;
  appRole?: Maybe<AppRole>;
  appRoles: Array<AppRole>;
  builds: Array<Build>;
  build: Build;
  action: Action;
  deployments: Array<Deployment>;
  deployment: Deployment;
  app?: Maybe<App>;
  apps: Array<App>;
  pendingChanges: Array<PendingChange>;
  appAvailableGithubRepos: Array<GithubRepo>;
  appValidateBeforeCommit: AppValidationResult;
  commit?: Maybe<Commit>;
  commits?: Maybe<Array<Commit>>;
  me: User;
  userApiTokens: Array<ApiToken>;
  ConnectorRestApi?: Maybe<ConnectorRestApi>;
  ConnectorRestApis: Array<ConnectorRestApi>;
  blockVersions: Array<BlockVersion>;
  blocks: Array<Block>;
  ConnectorRestApiCall?: Maybe<ConnectorRestApiCall>;
  ConnectorRestApiCalls: Array<ConnectorRestApiCall>;
  EntityPage?: Maybe<EntityPage>;
  EntityPages: Array<EntityPage>;
};

export type QueryWorkspaceArgs = {
  where: WhereUniqueInput;
};

export type QueryEntityArgs = {
  where: WhereUniqueInput;
};

export type QueryEntitiesArgs = {
  where?: Maybe<EntityWhereInput>;
  orderBy?: Maybe<EntityOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryAppRoleArgs = {
  where: WhereUniqueInput;
  version?: Maybe<Scalars["Float"]>;
};

export type QueryAppRolesArgs = {
  where?: Maybe<AppRoleWhereInput>;
  orderBy?: Maybe<AppRoleOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryBuildsArgs = {
  where?: Maybe<BuildWhereInput>;
  orderBy?: Maybe<BuildOrderByInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type QueryBuildArgs = {
  where: WhereUniqueInput;
};

export type QueryActionArgs = {
  where: WhereUniqueInput;
};

export type QueryDeploymentsArgs = {
  where?: Maybe<DeploymentWhereInput>;
  orderBy?: Maybe<DeploymentOrderByInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type QueryDeploymentArgs = {
  where: WhereUniqueInput;
};

export type QueryAppArgs = {
  where: WhereUniqueInput;
};

export type QueryAppsArgs = {
  where?: Maybe<AppWhereInput>;
  orderBy?: Maybe<AppOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryPendingChangesArgs = {
  where: PendingChangesFindInput;
};

export type QueryAppAvailableGithubReposArgs = {
  where: AvailableGithubReposFindInput;
};

export type QueryAppValidateBeforeCommitArgs = {
  where: WhereUniqueInput;
};

export type QueryCommitArgs = {
  where: CommitWhereUniqueInput;
};

export type QueryCommitsArgs = {
  where?: Maybe<CommitWhereInput>;
  orderBy?: Maybe<CommitOrderByInput>;
  cursor?: Maybe<CommitWhereUniqueInput>;
  take?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type QueryConnectorRestApiArgs = {
  where: WhereUniqueInput;
  version?: Maybe<Scalars["Float"]>;
};

export type QueryConnectorRestApisArgs = {
  where?: Maybe<ConnectorRestApiWhereInput>;
  orderBy?: Maybe<ConnectorRestApiOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryBlockVersionsArgs = {
  where?: Maybe<BlockVersionWhereInput>;
  orderBy?: Maybe<BlockVersionOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryBlocksArgs = {
  where?: Maybe<BlockWhereInput>;
  orderBy?: Maybe<BlockOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryConnectorRestApiCallArgs = {
  where: WhereUniqueInput;
  version?: Maybe<Scalars["Float"]>;
};

export type QueryConnectorRestApiCallsArgs = {
  where?: Maybe<ConnectorRestApiCallWhereInput>;
  orderBy?: Maybe<ConnectorRestApiCallOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryEntityPageArgs = {
  where: WhereUniqueInput;
  version?: Maybe<Scalars["Float"]>;
};

export type QueryEntityPagesArgs = {
  where?: Maybe<EntityPageWhereInput>;
  orderBy?: Maybe<EntityPageOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export enum QueryMode {
  Default = "Default",
  Insensitive = "Insensitive",
}

export enum Role {
  Admin = "Admin",
  User = "User",
  OrganizationAdmin = "OrganizationAdmin",
  ProjectAdmin = "ProjectAdmin",
}

export type SignupInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  workspaceName: Scalars["String"];
};

export enum SortOrder {
  Asc = "Asc",
  Desc = "Desc",
}

export type StringFilter = {
  equals?: Maybe<Scalars["String"]>;
  not?: Maybe<Scalars["String"]>;
  in?: Maybe<Array<Scalars["String"]>>;
  notIn?: Maybe<Array<Scalars["String"]>>;
  lt?: Maybe<Scalars["String"]>;
  lte?: Maybe<Scalars["String"]>;
  gt?: Maybe<Scalars["String"]>;
  gte?: Maybe<Scalars["String"]>;
  contains?: Maybe<Scalars["String"]>;
  startsWith?: Maybe<Scalars["String"]>;
  endsWith?: Maybe<Scalars["String"]>;
  mode?: Maybe<QueryMode>;
};

export type UpdateAccountInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  account?: Maybe<Account>;
  workspace?: Maybe<Workspace>;
  userRoles?: Maybe<Array<UserRole>>;
  isOwner: Scalars["Boolean"];
};

export type UserRole = {
  __typename?: "UserRole";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  role: Role;
};

export type WhereParentIdInput = {
  connect: WhereUniqueInput;
};

export type WhereUniqueInput = {
  id: Scalars["String"];
};

export type Workspace = {
  __typename?: "Workspace";
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  apps: Array<App>;
  users: Array<User>;
};

export type WorkspaceCreateInput = {
  name: Scalars["String"];
};

export type WorkspaceUpdateInput = {
  name?: Maybe<Scalars["String"]>;
};
