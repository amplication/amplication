export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  createdAt: Scalars["DateTime"];
  email: Scalars["String"];
  firstName: Scalars["String"];
  githubId?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

export type Action = {
  __typename?: "Action";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  steps?: Maybe<Array<ActionStep>>;
};

export type ActionLog = {
  __typename?: "ActionLog";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  level: EnumActionLogLevel;
  message: Scalars["String"];
  meta: Scalars["JSONObject"];
};

export type ActionStep = {
  __typename?: "ActionStep";
  completedAt?: Maybe<Scalars["DateTime"]>;
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  logs?: Maybe<Array<ActionLog>>;
  message: Scalars["String"];
  name: Scalars["String"];
  status: EnumActionStepStatus;
};

export type AdminUiSettings = {
  __typename?: "AdminUISettings";
  adminUIPath: Scalars["String"];
  generateAdminUI: Scalars["Boolean"];
};

export type AdminUiSettingsUpdateInput = {
  adminUIPath?: InputMaybe<Scalars["String"]>;
  generateAdminUI?: InputMaybe<Scalars["Boolean"]>;
};

export type ApiToken = {
  __typename?: "ApiToken";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  lastAccessAt: Scalars["DateTime"];
  name: Scalars["String"];
  previewChars: Scalars["String"];
  token?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["DateTime"];
  userId: Scalars["String"];
};

export type ApiTokenCreateInput = {
  name: Scalars["String"];
};

export type Auth = {
  __typename?: "Auth";
  /** JWT Bearer token */
  token: Scalars["String"];
};

export type AuthorizeResourceWithGitResult = {
  __typename?: "AuthorizeResourceWithGitResult";
  url: Scalars["String"];
};

export type Block = {
  __typename?: "Block";
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  id: Scalars["String"];
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUser: Array<User>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  parentBlock?: Maybe<Block>;
  resource?: Maybe<Resource>;
  updatedAt: Scalars["DateTime"];
  versionNumber?: Maybe<Scalars["Float"]>;
  versions?: Maybe<Array<BlockVersion>>;
};

export type BlockVersionsArgs = {
  orderBy?: InputMaybe<BlockVersionOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BlockVersionWhereInput>;
};

export type BlockInputOutput = {
  __typename?: "BlockInputOutput";
  dataType?: Maybe<EnumDataType>;
  dataTypeEntityName?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
  includeAllPropertiesByDefault?: Maybe<Scalars["Boolean"]>;
  isList?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  propertyList?: Maybe<Array<PropertySelector>>;
};

export type BlockInputOutputInput = {
  dataType?: InputMaybe<EnumDataType>;
  dataTypeEntityName?: InputMaybe<Scalars["String"]>;
  description: Scalars["String"];
  includeAllPropertiesByDefault?: InputMaybe<Scalars["Boolean"]>;
  isList?: InputMaybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  propertyList?: InputMaybe<Array<PropertySelectorInput>>;
};

export type BlockOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type BlockUpdateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
};

export type BlockVersion = {
  __typename?: "BlockVersion";
  block: Block;
  commit?: Maybe<Commit>;
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  id: Scalars["String"];
  settings?: Maybe<Scalars["JSONObject"]>;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Int"];
};

export type BlockVersionOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  versionNumber?: InputMaybe<SortOrder>;
};

export type BlockVersionWhereInput = {
  block?: InputMaybe<WhereUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  versionNumber?: InputMaybe<IntFilter>;
};

export type BlockWhereInput = {
  blockType?: InputMaybe<EnumBlockTypeFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars["Boolean"]>;
  not?: InputMaybe<Scalars["Boolean"]>;
};

export type Build = {
  __typename?: "Build";
  action?: Maybe<Action>;
  actionId: Scalars["String"];
  archiveURI: Scalars["String"];
  commit: Commit;
  commitId: Scalars["String"];
  createdAt: Scalars["DateTime"];
  createdBy: User;
  id: Scalars["String"];
  message: Scalars["String"];
  resource?: Maybe<Resource>;
  resourceId: Scalars["String"];
  status?: Maybe<EnumBuildStatus>;
  userId: Scalars["String"];
  version: Scalars["String"];
};

export type BuildCreateInput = {
  commit: WhereParentIdInput;
  message: Scalars["String"];
  resource: WhereParentIdInput;
};

export type BuildOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type BuildWhereInput = {
  commit?: InputMaybe<WhereUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<WhereUniqueInput>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  resource: WhereUniqueInput;
  version?: InputMaybe<StringFilter>;
};

export type ChangePasswordInput = {
  newPassword: Scalars["String"];
  oldPassword: Scalars["String"];
};

export type Commit = {
  __typename?: "Commit";
  builds?: Maybe<Array<Build>>;
  changes?: Maybe<Array<PendingChange>>;
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  message: Scalars["String"];
  user?: Maybe<User>;
  userId: Scalars["String"];
};

export type CommitBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BuildWhereInput>;
};

export type CommitCreateInput = {
  message: Scalars["String"];
  project: WhereParentIdInput;
};

export type CommitOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
};

export type CommitWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  project: WhereUniqueInput;
  user?: InputMaybe<WhereUniqueInput>;
};

export type CommitWhereUniqueInput = {
  id?: InputMaybe<Scalars["String"]>;
};

export type CompleteInvitationInput = {
  token: Scalars["String"];
};

export type ConnectGitRepositoryInput = {
  gitOrganizationId: Scalars["String"];
  name: Scalars["String"];
  resourceId: Scalars["String"];
};

export type ConnectorRestApi = IBlock & {
  __typename?: "ConnectorRestApi";
  authenticationType: EnumConnectorRestApiAuthenticationType;
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  httpBasicAuthenticationSettings?: Maybe<HttpBasicAuthenticationSettings>;
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  privateKeyAuthenticationSettings?: Maybe<PrivateKeyAuthenticationSettings>;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Float"];
};

export type ConnectorRestApiCall = IBlock & {
  __typename?: "ConnectorRestApiCall";
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  updatedAt: Scalars["DateTime"];
  url: Scalars["String"];
  versionNumber: Scalars["Float"];
};

export type ConnectorRestApiCallCreateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName: Scalars["String"];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
  url: Scalars["String"];
};

export type ConnectorRestApiCallOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ConnectorRestApiCallWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ConnectorRestApiCreateInput = {
  authenticationType: EnumConnectorRestApiAuthenticationType;
  description?: InputMaybe<Scalars["String"]>;
  displayName: Scalars["String"];
  httpBasicAuthenticationSettings?: InputMaybe<
    HttpBasicAuthenticationSettingsInput
  >;
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  privateKeyAuthenticationSettings?: InputMaybe<
    PrivateKeyAuthenticationSettingsInput
  >;
  resource: WhereParentIdInput;
};

export type ConnectorRestApiOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ConnectorRestApiWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type CreateGitRepositoryInput = {
  gitOrganizationId: Scalars["String"];
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  name: Scalars["String"];
  public: Scalars["Boolean"];
  resourceId: Scalars["String"];
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars["DateTime"]>;
  gt?: InputMaybe<Scalars["DateTime"]>;
  gte?: InputMaybe<Scalars["DateTime"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]>>;
  lt?: InputMaybe<Scalars["DateTime"]>;
  lte?: InputMaybe<Scalars["DateTime"]>;
  not?: InputMaybe<Scalars["DateTime"]>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]>>;
};

export type Entity = {
  __typename?: "Entity";
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  fields?: Maybe<Array<EntityField>>;
  id: Scalars["String"];
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars["String"];
  resource?: Maybe<Resource>;
  resourceId: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  versions?: Maybe<Array<EntityVersion>>;
};

export type EntityFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityFieldWhereInput>;
};

export type EntityVersionsArgs = {
  orderBy?: InputMaybe<EntityVersionOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityVersionWhereInput>;
};

export type EntityAddPermissionFieldInput = {
  action: EnumEntityAction;
  entity: WhereParentIdInput;
  fieldName: Scalars["String"];
};

export type EntityCreateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName: Scalars["String"];
  name: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  resource: WhereParentIdInput;
};

export type EntityField = {
  __typename?: "EntityField";
  createdAt: Scalars["DateTime"];
  dataType: EnumDataType;
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  permanentId: Scalars["String"];
  position?: Maybe<Scalars["Int"]>;
  properties?: Maybe<Scalars["JSONObject"]>;
  required: Scalars["Boolean"];
  searchable: Scalars["Boolean"];
  unique: Scalars["Boolean"];
  updatedAt: Scalars["DateTime"];
};

export type EntityFieldCreateByDisplayNameInput = {
  dataType?: InputMaybe<EnumDataType>;
  displayName: Scalars["String"];
  entity: WhereParentIdInput;
};

export type EntityFieldCreateInput = {
  dataType: EnumDataType;
  description: Scalars["String"];
  displayName: Scalars["String"];
  entity: WhereParentIdInput;
  name: Scalars["String"];
  position?: InputMaybe<Scalars["Int"]>;
  properties: Scalars["JSONObject"];
  required: Scalars["Boolean"];
  searchable: Scalars["Boolean"];
  unique: Scalars["Boolean"];
};

export type EntityFieldFilter = {
  every?: InputMaybe<EntityFieldWhereInput>;
  none?: InputMaybe<EntityFieldWhereInput>;
  some?: InputMaybe<EntityFieldWhereInput>;
};

export type EntityFieldOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  dataType?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  permanentId?: InputMaybe<SortOrder>;
  position?: InputMaybe<SortOrder>;
  required?: InputMaybe<SortOrder>;
  searchable?: InputMaybe<SortOrder>;
  unique?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type EntityFieldUpdateInput = {
  dataType?: InputMaybe<EnumDataType>;
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  position?: InputMaybe<Scalars["Int"]>;
  properties?: InputMaybe<Scalars["JSONObject"]>;
  required?: InputMaybe<Scalars["Boolean"]>;
  searchable?: InputMaybe<Scalars["Boolean"]>;
  unique?: InputMaybe<Scalars["Boolean"]>;
};

export type EntityFieldWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  dataType?: InputMaybe<EnumDataTypeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  permanentId?: InputMaybe<StringFilter>;
  required?: InputMaybe<BooleanFilter>;
  searchable?: InputMaybe<BooleanFilter>;
  unique?: InputMaybe<BooleanFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type EntityOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  pluralDisplayName?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type EntityPage = IBlock & {
  __typename?: "EntityPage";
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  entityId: Scalars["String"];
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  listSettings?: Maybe<EntityPageListSettings>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  pageType: EnumEntityPageType;
  parentBlock?: Maybe<Block>;
  showAllFields: Scalars["Boolean"];
  showFieldList?: Maybe<Array<Scalars["String"]>>;
  singleRecordSettings?: Maybe<EntityPageSingleRecordSettings>;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Float"];
};

export type EntityPageCreateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName: Scalars["String"];
  entityId?: InputMaybe<Scalars["String"]>;
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  listSettings?: InputMaybe<EntityPageListSettingsInput>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  pageType: EnumEntityPageType;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
  showAllFields: Scalars["Boolean"];
  showFieldList?: InputMaybe<Array<Scalars["String"]>>;
  singleRecordSettings?: InputMaybe<EntityPageSingleRecordSettingsInput>;
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
  navigateToPageId?: InputMaybe<Scalars["String"]>;
};

export type EntityPageOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  entityId?: InputMaybe<Scalars["String"]>;
  listSettings?: InputMaybe<EntityPageListSettingsInput>;
  pageType: EnumEntityPageType;
  showAllFields: Scalars["Boolean"];
  showFieldList?: InputMaybe<Array<Scalars["String"]>>;
  singleRecordSettings?: InputMaybe<EntityPageSingleRecordSettingsInput>;
};

export type EntityPageWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type EntityPermission = {
  __typename?: "EntityPermission";
  action: EnumEntityAction;
  entityVersion?: Maybe<EntityVersion>;
  entityVersionId: Scalars["String"];
  id: Scalars["String"];
  permissionFields?: Maybe<Array<EntityPermissionField>>;
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
  type: EnumEntityPermissionType;
};

export type EntityPermissionField = {
  __typename?: "EntityPermissionField";
  entityVersionId: Scalars["String"];
  field: EntityField;
  fieldPermanentId: Scalars["String"];
  id: Scalars["String"];
  permission?: Maybe<EntityPermission>;
  permissionId: Scalars["String"];
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
};

export type EntityPermissionFieldWhereUniqueInput = {
  action: EnumEntityAction;
  entityId: Scalars["String"];
  fieldPermanentId: Scalars["String"];
};

export type EntityPermissionRole = {
  __typename?: "EntityPermissionRole";
  action: EnumEntityAction;
  entityPermission?: Maybe<EntityPermission>;
  entityVersionId: Scalars["String"];
  id: Scalars["String"];
  resourceRole: ResourceRole;
  resourceRoleId: Scalars["String"];
};

export type EntityUpdateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  pluralDisplayName?: InputMaybe<Scalars["String"]>;
};

export type EntityUpdatePermissionFieldRolesInput = {
  addPermissionRoles?: InputMaybe<Array<WhereUniqueInput>>;
  deletePermissionRoles?: InputMaybe<Array<WhereUniqueInput>>;
  permissionField: WhereParentIdInput;
};

export type EntityUpdatePermissionInput = {
  action: EnumEntityAction;
  type: EnumEntityPermissionType;
};

export type EntityUpdatePermissionRolesInput = {
  action: EnumEntityAction;
  addRoles?: InputMaybe<Array<WhereUniqueInput>>;
  deleteRoles?: InputMaybe<Array<WhereUniqueInput>>;
  entity: WhereParentIdInput;
};

export type EntityVersion = {
  __typename?: "EntityVersion";
  commit?: Maybe<Commit>;
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  entity: Entity;
  entityId: Scalars["String"];
  fields: Array<EntityField>;
  id: Scalars["String"];
  name: Scalars["String"];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Int"];
};

export type EntityVersionFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityFieldWhereInput>;
};

export type EntityVersionOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  pluralDisplayName?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  versionNumber?: InputMaybe<SortOrder>;
};

export type EntityVersionWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  entity?: InputMaybe<WhereUniqueInput>;
  id?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  pluralDisplayName?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  versionNumber?: InputMaybe<IntFilter>;
};

export type EntityWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  fields?: InputMaybe<EntityFieldFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  pluralDisplayName?: InputMaybe<StringFilter>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum EnumActionLogLevel {
  Debug = "Debug",
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

export enum EnumActionStepStatus {
  Failed = "Failed",
  Running = "Running",
  Success = "Success",
  Waiting = "Waiting",
}

export enum EnumAuthProviderType {
  Http = "Http",
  Jwt = "Jwt",
}

export enum EnumBlockType {
  CanvasPage = "CanvasPage",
  ConnectorFile = "ConnectorFile",
  ConnectorRestApi = "ConnectorRestApi",
  ConnectorRestApiCall = "ConnectorRestApiCall",
  ConnectorSoapApi = "ConnectorSoapApi",
  Document = "Document",
  EntityApi = "EntityApi",
  EntityApiEndpoint = "EntityApiEndpoint",
  EntityPage = "EntityPage",
  Flow = "Flow",
  FlowApi = "FlowApi",
  Layout = "Layout",
  ProjectConfigurationSettings = "ProjectConfigurationSettings",
  ServiceSettings = "ServiceSettings",
}

export type EnumBlockTypeFilter = {
  equals?: InputMaybe<EnumBlockType>;
  in?: InputMaybe<Array<EnumBlockType>>;
  not?: InputMaybe<EnumBlockType>;
  notIn?: InputMaybe<Array<EnumBlockType>>;
};

export enum EnumBuildStatus {
  Completed = "Completed",
  Failed = "Failed",
  Invalid = "Invalid",
  Running = "Running",
}

export enum EnumConnectorRestApiAuthenticationType {
  HttpBasicAuthentication = "HttpBasicAuthentication",
  None = "None",
  OAuth2PasswordFlow = "OAuth2PasswordFlow",
  OAuth2UserAgentFlow = "OAuth2UserAgentFlow",
  PrivateKey = "PrivateKey",
}

export enum EnumDataType {
  Boolean = "Boolean",
  CreatedAt = "CreatedAt",
  DateTime = "DateTime",
  DecimalNumber = "DecimalNumber",
  Email = "Email",
  GeographicLocation = "GeographicLocation",
  Id = "Id",
  Json = "Json",
  Lookup = "Lookup",
  MultiLineText = "MultiLineText",
  MultiSelectOptionSet = "MultiSelectOptionSet",
  OptionSet = "OptionSet",
  Password = "Password",
  Roles = "Roles",
  SingleLineText = "SingleLineText",
  UpdatedAt = "UpdatedAt",
  Username = "Username",
  WholeNumber = "WholeNumber",
}

export type EnumDataTypeFilter = {
  equals?: InputMaybe<EnumDataType>;
  in?: InputMaybe<Array<EnumDataType>>;
  not?: InputMaybe<EnumDataType>;
  notIn?: InputMaybe<Array<EnumDataType>>;
};

export enum EnumEntityAction {
  Create = "Create",
  Delete = "Delete",
  Search = "Search",
  Update = "Update",
  View = "View",
}

export enum EnumEntityPageType {
  List = "List",
  MasterDetails = "MasterDetails",
  SingleRecord = "SingleRecord",
}

export enum EnumEntityPermissionType {
  AllRoles = "AllRoles",
  Disabled = "Disabled",
  Granular = "Granular",
  Public = "Public",
}

export enum EnumGitOrganizationType {
  Organization = "Organization",
  User = "User",
}

export enum EnumGitProvider {
  Github = "Github",
}

export enum EnumPendingChangeAction {
  Create = "Create",
  Delete = "Delete",
  Update = "Update",
}

export enum EnumPendingChangeOriginType {
  Block = "Block",
  Entity = "Entity",
}

export enum EnumResourceType {
  ProjectConfiguration = "ProjectConfiguration",
  Service = "Service",
}

export enum EnumSubscriptionPlan {
  Business = "Business",
  Enterprise = "Enterprise",
  Pro = "Pro",
}

export enum EnumSubscriptionStatus {
  Active = "Active",
  Deleted = "Deleted",
  PastDue = "PastDue",
  Paused = "Paused",
  Trailing = "Trailing",
}

export enum EnumWorkspaceMemberType {
  Invitation = "Invitation",
  User = "User",
}

export type Environment = {
  __typename?: "Environment";
  address: Scalars["String"];
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  name: Scalars["String"];
  resource: Resource;
  resourceId: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

export type GitGetInstallationUrlInput = {
  gitProvider: EnumGitProvider;
};

export type GitOrganization = {
  __typename?: "GitOrganization";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  installationId: Scalars["String"];
  name: Scalars["String"];
  provider: EnumGitProvider;
  type: EnumGitOrganizationType;
  updatedAt: Scalars["DateTime"];
};

export type GitOrganizationCreateInput = {
  gitProvider: EnumGitProvider;
  installationId: Scalars["String"];
};

export type GitOrganizationWhereInput = {
  id?: InputMaybe<Scalars["String"]>;
};

export type GitRepository = {
  __typename?: "GitRepository";
  createdAt?: Maybe<Scalars["DateTime"]>;
  gitOrganization: GitOrganization;
  gitOrganizationId: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type HttpBasicAuthenticationSettings = {
  __typename?: "HttpBasicAuthenticationSettings";
  password: Scalars["String"];
  username: Scalars["String"];
};

export type HttpBasicAuthenticationSettingsInput = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type IBlock = {
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Float"];
};

export type IEntityPageSettings = {
  allowCreation: Scalars["Boolean"];
  allowDeletion: Scalars["Boolean"];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars["Int"]>;
  gt?: InputMaybe<Scalars["Int"]>;
  gte?: InputMaybe<Scalars["Int"]>;
  in?: InputMaybe<Array<Scalars["Int"]>>;
  lt?: InputMaybe<Scalars["Int"]>;
  lte?: InputMaybe<Scalars["Int"]>;
  not?: InputMaybe<Scalars["Int"]>;
  notIn?: InputMaybe<Array<Scalars["Int"]>>;
};

export type Invitation = {
  __typename?: "Invitation";
  createdAt: Scalars["DateTime"];
  email: Scalars["String"];
  id: Scalars["String"];
  invitedByUser?: Maybe<User>;
  updatedAt: Scalars["DateTime"];
  workspace?: Maybe<Workspace>;
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
  addEntityPermissionField: EntityPermissionField;
  changePassword: Account;
  commit?: Maybe<Commit>;
  completeInvitation: Auth;
  connectResourceGitRepository: Resource;
  connectResourceToProjectRepository: Resource;
  createApiToken: ApiToken;
  createBuild: Build;
  createConnectorRestApi: ConnectorRestApi;
  createConnectorRestApiCall: ConnectorRestApiCall;
  createDefaultRelatedField: EntityField;
  createEntityField: EntityField;
  createEntityFieldByDisplayName: EntityField;
  createEntityPage: EntityPage;
  createGitRepository: Resource;
  createOneEntity: Entity;
  createOrganization: GitOrganization;
  createProject: Project;
  createResource: Resource;
  createResourceRole: ResourceRole;
  createResourceWithEntities: Resource;
  createWorkspace?: Maybe<Workspace>;
  deleteApiToken: ApiToken;
  deleteEntity?: Maybe<Entity>;
  deleteEntityField: EntityField;
  deleteEntityPermissionField: EntityPermissionField;
  deleteGitOrganization: Scalars["Boolean"];
  deleteGitRepository: Resource;
  deleteResource?: Maybe<Resource>;
  deleteResourceRole?: Maybe<ResourceRole>;
  deleteUser?: Maybe<User>;
  deleteWorkspace?: Maybe<Workspace>;
  discardPendingChanges?: Maybe<Scalars["Boolean"]>;
  disconnectResourceGitRepository: Resource;
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
  inviteUser?: Maybe<Invitation>;
  lockEntity?: Maybe<Entity>;
  login: Auth;
  resendInvitation?: Maybe<Invitation>;
  revokeInvitation?: Maybe<Invitation>;
  setCurrentWorkspace: Auth;
  signup: Auth;
  updateAccount: Account;
  updateConnectorRestApi: ConnectorRestApi;
  updateConnectorRestApiCall: ConnectorRestApiCall;
  updateEntity?: Maybe<Entity>;
  updateEntityField: EntityField;
  updateEntityPage: EntityPage;
  updateEntityPermission: EntityPermission;
  updateEntityPermissionFieldRoles: EntityPermissionField;
  updateEntityPermissionRoles: EntityPermission;
  updateProjectConfigurationSettings?: Maybe<ProjectConfigurationSettings>;
  updateResource?: Maybe<Resource>;
  updateResourceRole?: Maybe<ResourceRole>;
  updateServiceSettings?: Maybe<ServiceSettings>;
  updateWorkspace?: Maybe<Workspace>;
};

export type MutationAddEntityPermissionFieldArgs = {
  data: EntityAddPermissionFieldInput;
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationCommitArgs = {
  data: CommitCreateInput;
};

export type MutationCompleteInvitationArgs = {
  data: CompleteInvitationInput;
};

export type MutationConnectResourceGitRepositoryArgs = {
  data: ConnectGitRepositoryInput;
};

export type MutationConnectResourceToProjectRepositoryArgs = {
  resourceId: Scalars["String"];
};

export type MutationCreateApiTokenArgs = {
  data: ApiTokenCreateInput;
};

export type MutationCreateBuildArgs = {
  data: BuildCreateInput;
};

export type MutationCreateConnectorRestApiArgs = {
  data: ConnectorRestApiCreateInput;
};

export type MutationCreateConnectorRestApiCallArgs = {
  data: ConnectorRestApiCallCreateInput;
};

export type MutationCreateDefaultRelatedFieldArgs = {
  relatedFieldDisplayName?: InputMaybe<Scalars["String"]>;
  relatedFieldName?: InputMaybe<Scalars["String"]>;
  where: WhereUniqueInput;
};

export type MutationCreateEntityFieldArgs = {
  data: EntityFieldCreateInput;
  relatedFieldDisplayName?: InputMaybe<Scalars["String"]>;
  relatedFieldName?: InputMaybe<Scalars["String"]>;
};

export type MutationCreateEntityFieldByDisplayNameArgs = {
  data: EntityFieldCreateByDisplayNameInput;
};

export type MutationCreateEntityPageArgs = {
  data: EntityPageCreateInput;
};

export type MutationCreateGitRepositoryArgs = {
  data: CreateGitRepositoryInput;
};

export type MutationCreateOneEntityArgs = {
  data: EntityCreateInput;
};

export type MutationCreateOrganizationArgs = {
  data: GitOrganizationCreateInput;
};

export type MutationCreateProjectArgs = {
  data: ProjectCreateInput;
};

export type MutationCreateResourceArgs = {
  data: ResourceCreateInput;
};

export type MutationCreateResourceRoleArgs = {
  data: ResourceRoleCreateInput;
};

export type MutationCreateResourceWithEntitiesArgs = {
  data: ResourceCreateWithEntitiesInput;
};

export type MutationCreateWorkspaceArgs = {
  data: WorkspaceCreateInput;
};

export type MutationDeleteApiTokenArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteEntityArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteEntityFieldArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteEntityPermissionFieldArgs = {
  where: EntityPermissionFieldWhereUniqueInput;
};

export type MutationDeleteGitOrganizationArgs = {
  gitOrganizationId: Scalars["String"];
  gitProvider: EnumGitProvider;
};

export type MutationDeleteGitRepositoryArgs = {
  gitRepositoryId: Scalars["String"];
};

export type MutationDeleteResourceArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteResourceRoleArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteUserArgs = {
  where: WhereUniqueInput;
};

export type MutationDeleteWorkspaceArgs = {
  where: WhereUniqueInput;
};

export type MutationDiscardPendingChangesArgs = {
  data: PendingChangesDiscardInput;
};

export type MutationDisconnectResourceGitRepositoryArgs = {
  resourceId: Scalars["String"];
};

export type MutationGetGitResourceInstallationUrlArgs = {
  data: GitGetInstallationUrlInput;
};

export type MutationInviteUserArgs = {
  data: InviteUserInput;
};

export type MutationLockEntityArgs = {
  where: WhereUniqueInput;
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationResendInvitationArgs = {
  where: WhereUniqueInput;
};

export type MutationRevokeInvitationArgs = {
  where: WhereUniqueInput;
};

export type MutationSetCurrentWorkspaceArgs = {
  data: WhereUniqueInput;
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export type MutationUpdateAccountArgs = {
  data: UpdateAccountInput;
};

export type MutationUpdateConnectorRestApiArgs = {
  data: BlockUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateConnectorRestApiCallArgs = {
  data: BlockUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityArgs = {
  data: EntityUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityFieldArgs = {
  data: EntityFieldUpdateInput;
  relatedFieldDisplayName?: InputMaybe<Scalars["String"]>;
  relatedFieldName?: InputMaybe<Scalars["String"]>;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityPageArgs = {
  data: EntityPageUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityPermissionArgs = {
  data: EntityUpdatePermissionInput;
  where: WhereUniqueInput;
};

export type MutationUpdateEntityPermissionFieldRolesArgs = {
  data: EntityUpdatePermissionFieldRolesInput;
};

export type MutationUpdateEntityPermissionRolesArgs = {
  data: EntityUpdatePermissionRolesInput;
};

export type MutationUpdateProjectConfigurationSettingsArgs = {
  data: ProjectConfigurationSettingsUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateResourceArgs = {
  data: ResourceUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateResourceRoleArgs = {
  data: ResourceRoleUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateServiceSettingsArgs = {
  data: ServiceSettingsUpdateInput;
  where: WhereUniqueInput;
};

export type MutationUpdateWorkspaceArgs = {
  data: WorkspaceUpdateInput;
  where: WhereUniqueInput;
};

export type PendingChange = {
  __typename?: "PendingChange";
  action: EnumPendingChangeAction;
  origin: PendingChangeOrigin;
  originId: Scalars["String"];
  originType: EnumPendingChangeOriginType;
  resource: Resource;
  versionNumber: Scalars["Int"];
};

export type PendingChangeOrigin = Block | Entity;

export type PendingChangesDiscardInput = {
  project: WhereParentIdInput;
};

export type PendingChangesFindInput = {
  project: WhereUniqueInput;
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

export type Project = {
  __typename?: "Project";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  name: Scalars["String"];
  resources?: Maybe<Array<Resource>>;
  updatedAt: Scalars["DateTime"];
};

export type ProjectConfigurationSettings = IBlock & {
  __typename?: "ProjectConfigurationSettings";
  baseDirectory: Scalars["String"];
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Float"];
};

export type ProjectConfigurationSettingsUpdateInput = {
  baseDirectory?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
};

export type ProjectCreateInput = {
  name: Scalars["String"];
};

export type ProjectOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type ProjectWhereInput = {
  deletedAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<StringFilter>;
  resources?: InputMaybe<ResourceListRelationFilter>;
};

export type PropertySelector = {
  __typename?: "PropertySelector";
  include: Scalars["Boolean"];
  propertyName: Scalars["String"];
};

export type PropertySelectorInput = {
  include: Scalars["Boolean"];
  propertyName: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  account: Account;
  action: Action;
  block: Block;
  blocks: Array<Block>;
  build: Build;
  builds: Array<Build>;
  commit?: Maybe<Commit>;
  commits?: Maybe<Array<Commit>>;
  ConnectorRestApi?: Maybe<ConnectorRestApi>;
  ConnectorRestApiCall?: Maybe<ConnectorRestApiCall>;
  ConnectorRestApiCalls: Array<ConnectorRestApiCall>;
  ConnectorRestApis: Array<ConnectorRestApi>;
  currentWorkspace?: Maybe<Workspace>;
  entities: Array<Entity>;
  entity?: Maybe<Entity>;
  EntityPage?: Maybe<EntityPage>;
  EntityPages: Array<EntityPage>;
  gitOrganization: GitOrganization;
  gitOrganizations: Array<GitOrganization>;
  me: User;
  pendingChanges: Array<PendingChange>;
  project?: Maybe<Project>;
  projectConfigurationSettings: ProjectConfigurationSettings;
  projects: Array<Project>;
  remoteGitRepositories: Array<RemoteGitRepository>;
  resource?: Maybe<Resource>;
  resourceRole?: Maybe<ResourceRole>;
  resourceRoles: Array<ResourceRole>;
  resources: Array<Resource>;
  serviceSettings: ServiceSettings;
  userApiTokens: Array<ApiToken>;
  workspace?: Maybe<Workspace>;
  workspaceMembers?: Maybe<Array<WorkspaceMember>>;
  workspaces: Array<Workspace>;
};

export type QueryActionArgs = {
  where: WhereUniqueInput;
};

export type QueryBlockArgs = {
  where: WhereUniqueInput;
};

export type QueryBlocksArgs = {
  orderBy?: InputMaybe<BlockOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BlockWhereInput>;
};

export type QueryBuildArgs = {
  where: WhereUniqueInput;
};

export type QueryBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BuildWhereInput>;
};

export type QueryCommitArgs = {
  where: CommitWhereUniqueInput;
};

export type QueryCommitsArgs = {
  cursor?: InputMaybe<CommitWhereUniqueInput>;
  orderBy?: InputMaybe<CommitOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<CommitWhereInput>;
};

export type QueryConnectorRestApiArgs = {
  where: WhereUniqueInput;
};

export type QueryConnectorRestApiCallArgs = {
  where: WhereUniqueInput;
};

export type QueryConnectorRestApiCallsArgs = {
  orderBy?: InputMaybe<ConnectorRestApiCallOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ConnectorRestApiCallWhereInput>;
};

export type QueryConnectorRestApisArgs = {
  orderBy?: InputMaybe<ConnectorRestApiOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ConnectorRestApiWhereInput>;
};

export type QueryEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityWhereInput>;
};

export type QueryEntityArgs = {
  where: WhereUniqueInput;
};

export type QueryEntityPageArgs = {
  where: WhereUniqueInput;
};

export type QueryEntityPagesArgs = {
  orderBy?: InputMaybe<EntityPageOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityPageWhereInput>;
};

export type QueryGitOrganizationArgs = {
  where: WhereUniqueInput;
};

export type QueryGitOrganizationsArgs = {
  skip?: InputMaybe<Scalars["Float"]>;
  take?: InputMaybe<Scalars["Float"]>;
  where?: InputMaybe<GitOrganizationWhereInput>;
};

export type QueryPendingChangesArgs = {
  where: PendingChangesFindInput;
};

export type QueryProjectArgs = {
  where: WhereUniqueInput;
};

export type QueryProjectConfigurationSettingsArgs = {
  where: WhereUniqueInput;
};

export type QueryProjectsArgs = {
  orderBy?: InputMaybe<ProjectOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProjectWhereInput>;
};

export type QueryRemoteGitRepositoriesArgs = {
  where: RemoteGitRepositoriesWhereUniqueInput;
};

export type QueryResourceArgs = {
  where: WhereUniqueInput;
};

export type QueryResourceRoleArgs = {
  version?: InputMaybe<Scalars["Float"]>;
  where: WhereUniqueInput;
};

export type QueryResourceRolesArgs = {
  orderBy?: InputMaybe<ResourceRoleOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ResourceRoleWhereInput>;
};

export type QueryResourcesArgs = {
  orderBy?: InputMaybe<ResourceOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ResourceWhereInput>;
};

export type QueryServiceSettingsArgs = {
  where: WhereUniqueInput;
};

export type QueryWorkspaceArgs = {
  where: WhereUniqueInput;
};

export enum QueryMode {
  Default = "Default",
  Insensitive = "Insensitive",
}

export type RemoteGitRepositoriesWhereUniqueInput = {
  gitOrganizationId: Scalars["String"];
  gitProvider: EnumGitProvider;
};

export type RemoteGitRepository = {
  __typename?: "RemoteGitRepository";
  admin: Scalars["Boolean"];
  fullName: Scalars["String"];
  name: Scalars["String"];
  private: Scalars["Boolean"];
  url: Scalars["String"];
};

export type Resource = {
  __typename?: "Resource";
  builds: Array<Build>;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  entities: Array<Entity>;
  environments: Array<Environment>;
  githubLastMessage?: Maybe<Scalars["String"]>;
  githubLastSync?: Maybe<Scalars["DateTime"]>;
  gitRepository?: Maybe<GitRepository>;
  gitRepositoryId?: Maybe<Scalars["String"]>;
  gitRepositoryOverride: Scalars["Boolean"];
  id: Scalars["String"];
  name: Scalars["String"];
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars["String"]>;
  resourceType: EnumResourceType;
  updatedAt: Scalars["DateTime"];
};

export type ResourceBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<BuildWhereInput>;
};

export type ResourceEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EntityWhereInput>;
};

export type ResourceCreateInput = {
  description: Scalars["String"];
  name: Scalars["String"];
  project: WhereParentIdInput;
  resourceType: EnumResourceType;
};

export type ResourceCreateWithEntitiesEntityInput = {
  fields: Array<ResourceCreateWithEntitiesFieldInput>;
  name: Scalars["String"];
  relationsToEntityIndex?: InputMaybe<Array<Scalars["Int"]>>;
};

export type ResourceCreateWithEntitiesFieldInput = {
  dataType?: InputMaybe<EnumDataType>;
  name: Scalars["String"];
};

export type ResourceCreateWithEntitiesInput = {
  commitMessage: Scalars["String"];
  entities: Array<ResourceCreateWithEntitiesEntityInput>;
  generationSettings: ResourceGenSettingsCreateInput;
  resource: ResourceCreateInput;
};

export type ResourceGenSettingsCreateInput = {
  generateAdminUI: Scalars["Boolean"];
  generateGraphQL: Scalars["Boolean"];
  generateRestApi: Scalars["Boolean"];
};

export type ResourceListRelationFilter = {
  every?: InputMaybe<ResourceWhereInput>;
  none?: InputMaybe<ResourceWhereInput>;
  some?: InputMaybe<ResourceWhereInput>;
};

export type ResourceOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ResourceRole = {
  __typename?: "ResourceRole";
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

export type ResourceRoleCreateInput = {
  description: Scalars["String"];
  displayName: Scalars["String"];
  name: Scalars["String"];
  resource: WhereParentIdInput;
};

export type ResourceRoleOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ResourceRoleUpdateInput = {
  description?: InputMaybe<Scalars["String"]>;
  displayName: Scalars["String"];
  name?: InputMaybe<Scalars["String"]>;
};

export type ResourceRoleWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<StringFilter>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ResourceUpdateInput = {
  description?: InputMaybe<Scalars["String"]>;
  gitRepositoryOverride?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type ResourceWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<StringFilter>;
  project?: InputMaybe<WhereUniqueInput>;
  projectId?: InputMaybe<Scalars["String"]>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum Role {
  Admin = "Admin",
  OrganizationAdmin = "OrganizationAdmin",
  ProjectAdmin = "ProjectAdmin",
  User = "User",
}

export type ServerSettings = {
  __typename?: "ServerSettings";
  generateGraphQL: Scalars["Boolean"];
  generateRestApi: Scalars["Boolean"];
  serverPath: Scalars["String"];
};

export type ServerSettingsUpdateInput = {
  generateGraphQL?: InputMaybe<Scalars["Boolean"]>;
  generateRestApi?: InputMaybe<Scalars["Boolean"]>;
  serverPath?: InputMaybe<Scalars["String"]>;
};

export type ServiceSettings = IBlock & {
  __typename?: "ServiceSettings";
  adminUISettings: AdminUiSettings;
  authProvider: EnumAuthProviderType;
  blockType: EnumBlockType;
  createdAt: Scalars["DateTime"];
  dbHost: Scalars["String"];
  dbName: Scalars["String"];
  dbPassword: Scalars["String"];
  dbPort: Scalars["Int"];
  dbUser: Scalars["String"];
  description: Scalars["String"];
  displayName: Scalars["String"];
  id: Scalars["String"];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars["DateTime"]>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  serverSettings: ServerSettings;
  updatedAt: Scalars["DateTime"];
  versionNumber: Scalars["Float"];
};

export type ServiceSettingsUpdateInput = {
  adminUISettings: AdminUiSettingsUpdateInput;
  authProvider: EnumAuthProviderType;
  dbHost: Scalars["String"];
  dbName: Scalars["String"];
  dbPassword: Scalars["String"];
  dbPort: Scalars["Int"];
  dbUser: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  serverSettings: ServerSettingsUpdateInput;
};

export type SignupInput = {
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
  workspaceName: Scalars["String"];
};

export enum SortOrder {
  Asc = "Asc",
  Desc = "Desc",
}

export type StringFilter = {
  contains?: InputMaybe<Scalars["String"]>;
  endsWith?: InputMaybe<Scalars["String"]>;
  equals?: InputMaybe<Scalars["String"]>;
  gt?: InputMaybe<Scalars["String"]>;
  gte?: InputMaybe<Scalars["String"]>;
  in?: InputMaybe<Array<Scalars["String"]>>;
  lt?: InputMaybe<Scalars["String"]>;
  lte?: InputMaybe<Scalars["String"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars["String"]>;
  notIn?: InputMaybe<Array<Scalars["String"]>>;
  startsWith?: InputMaybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  cancellationEffectiveDate?: Maybe<Scalars["DateTime"]>;
  cancelUrl?: Maybe<Scalars["String"]>;
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  nextBillDate?: Maybe<Scalars["DateTime"]>;
  price?: Maybe<Scalars["Float"]>;
  status: EnumSubscriptionStatus;
  subscriptionPlan: EnumSubscriptionPlan;
  updatedAt: Scalars["DateTime"];
  updateUrl?: Maybe<Scalars["String"]>;
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars["String"];
};

export type UpdateAccountInput = {
  firstName?: InputMaybe<Scalars["String"]>;
  lastName?: InputMaybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  account?: Maybe<Account>;
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  isOwner: Scalars["Boolean"];
  updatedAt: Scalars["DateTime"];
  userRoles?: Maybe<Array<UserRole>>;
  workspace?: Maybe<Workspace>;
};

export type UserRole = {
  __typename?: "UserRole";
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  role: Role;
  updatedAt: Scalars["DateTime"];
};

export type WhereParentIdInput = {
  connect: WhereUniqueInput;
};

export type WhereUniqueInput = {
  id: Scalars["String"];
};

export type Workspace = {
  __typename?: "Workspace";
  createdAt: Scalars["DateTime"];
  gitOrganizations?: Maybe<Array<GitOrganization>>;
  id: Scalars["String"];
  name: Scalars["String"];
  projects: Array<Project>;
  subscription?: Maybe<Subscription>;
  updatedAt: Scalars["DateTime"];
  users: Array<User>;
};

export type WorkspaceCreateInput = {
  name: Scalars["String"];
};

export type WorkspaceMember = {
  __typename?: "WorkspaceMember";
  member: WorkspaceMemberType;
  type: EnumWorkspaceMemberType;
};

export type WorkspaceMemberType = Invitation | User;

export type WorkspaceUpdateInput = {
  name?: InputMaybe<Scalars["String"]>;
};
