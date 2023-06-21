export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  githubId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Action = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  steps?: Maybe<Array<ActionStep>>;
};

export type ActionLog = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  level: EnumActionLogLevel;
  message: Scalars['String'];
  meta: Scalars['JSONObject'];
};

export type ActionStep = {
  completedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  logs?: Maybe<Array<ActionLog>>;
  message: Scalars['String'];
  name: Scalars['String'];
  status: EnumActionStepStatus;
};

export type AdminUiSettings = {
  adminUIPath: Scalars['String'];
  generateAdminUI: Scalars['Boolean'];
};

export type AdminUiSettingsUpdateInput = {
  adminUIPath?: InputMaybe<Scalars['String']>;
  generateAdminUI?: InputMaybe<Scalars['Boolean']>;
};

export type ApiToken = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lastAccessAt: Scalars['DateTime'];
  name: Scalars['String'];
  previewChars: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type ApiTokenCreateInput = {
  name: Scalars['String'];
};

export type Auth = {
  /** JWT Bearer token */
  token: Scalars['String'];
};

export type AuthorizeResourceWithGitResult = {
  url: Scalars['String'];
};

export type Block = {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUser: Array<User>;
  lockedByUserId?: Maybe<Scalars['String']>;
  parentBlock?: Maybe<Block>;
  resource?: Maybe<Resource>;
  updatedAt: Scalars['DateTime'];
  versionNumber?: Maybe<Scalars['Float']>;
  versions?: Maybe<Array<BlockVersion>>;
};


export type BlockVersionsArgs = {
  orderBy?: InputMaybe<BlockVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BlockVersionWhereInput>;
};

export type BlockInputOutput = {
  dataType?: Maybe<EnumDataType>;
  dataTypeEntityName?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  includeAllPropertiesByDefault?: Maybe<Scalars['Boolean']>;
  isList?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  propertyList?: Maybe<Array<PropertySelector>>;
};

export type BlockInputOutputInput = {
  dataType?: InputMaybe<EnumDataType>;
  dataTypeEntityName?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  includeAllPropertiesByDefault?: InputMaybe<Scalars['Boolean']>;
  isList?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
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

export type BlockVersion = {
  block: Block;
  commit?: Maybe<Commit>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  settings?: Maybe<Scalars['JSONObject']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Int'];
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
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<Scalars['Boolean']>;
};

export type Build = {
  action?: Maybe<Action>;
  actionId: Scalars['String'];
  archiveURI: Scalars['String'];
  commit: Commit;
  commitId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: User;
  id: Scalars['String'];
  message: Scalars['String'];
  resource?: Maybe<Resource>;
  resourceId: Scalars['String'];
  status?: Maybe<EnumBuildStatus>;
  userId: Scalars['String'];
  version: Scalars['String'];
};

export type BuildCreateInput = {
  commit: WhereParentIdInput;
  message: Scalars['String'];
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
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type Commit = {
  builds?: Maybe<Array<Build>>;
  changes?: Maybe<Array<PendingChange>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  message: Scalars['String'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};


export type CommitBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BuildWhereInput>;
};

export type CommitCreateInput = {
  message: Scalars['String'];
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
  id?: InputMaybe<Scalars['String']>;
};

export type CompleteInvitationInput = {
  token: Scalars['String'];
};

export type ConnectGitRepositoryInput = {
  gitOrganizationId: Scalars['String'];
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']>;
  isOverrideGitRepository?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  resourceId: Scalars['String'];
};

export type CreateGitRepositoryBaseInput = {
  gitOrganizationId: Scalars['String'];
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']>;
  isPublic: Scalars['Boolean'];
  name: Scalars['String'];
};

export type CreateGitRepositoryInput = {
  gitOrganizationId: Scalars['String'];
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']>;
  isPublic: Scalars['Boolean'];
  name: Scalars['String'];
  resourceId?: InputMaybe<Scalars['String']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<Scalars['DateTime']>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type DefaultEntitiesInput = {
  resourceId: Scalars['String'];
};

export type Entity = {
  createdAt: Scalars['DateTime'];
  customAttributes?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  fields?: Maybe<Array<EntityField>>;
  id: Scalars['String'];
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars['String'];
  resource?: Maybe<Resource>;
  resourceId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  versions?: Maybe<Array<EntityVersion>>;
};


export type EntityFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntityFieldWhereInput>;
};


export type EntityVersionsArgs = {
  orderBy?: InputMaybe<EntityVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntityVersionWhereInput>;
};

export type EntityAddPermissionFieldInput = {
  action: EnumEntityAction;
  entity: WhereParentIdInput;
  fieldName: Scalars['String'];
};

export type EntityCreateInput = {
  customAttributes?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  name: Scalars['String'];
  pluralDisplayName: Scalars['String'];
  resource: WhereParentIdInput;
};

export type EntityField = {
  createdAt: Scalars['DateTime'];
  customAttributes?: Maybe<Scalars['String']>;
  dataType: EnumDataType;
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  permanentId: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  properties?: Maybe<Scalars['JSONObject']>;
  required: Scalars['Boolean'];
  searchable: Scalars['Boolean'];
  unique: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type EntityFieldCreateByDisplayNameInput = {
  dataType?: InputMaybe<EnumDataType>;
  displayName: Scalars['String'];
  entity: WhereParentIdInput;
};

export type EntityFieldCreateInput = {
  customAttributes?: InputMaybe<Scalars['String']>;
  dataType: EnumDataType;
  description: Scalars['String'];
  displayName: Scalars['String'];
  entity: WhereParentIdInput;
  name: Scalars['String'];
  position?: InputMaybe<Scalars['Int']>;
  properties: Scalars['JSONObject'];
  required: Scalars['Boolean'];
  searchable: Scalars['Boolean'];
  unique: Scalars['Boolean'];
};

export type EntityFieldFilter = {
  every?: InputMaybe<EntityFieldWhereInput>;
  none?: InputMaybe<EntityFieldWhereInput>;
  some?: InputMaybe<EntityFieldWhereInput>;
};

export type EntityFieldOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  customAttributes?: InputMaybe<SortOrder>;
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
  customAttributes?: InputMaybe<Scalars['String']>;
  dataType?: InputMaybe<EnumDataType>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  properties?: InputMaybe<Scalars['JSONObject']>;
  required?: InputMaybe<Scalars['Boolean']>;
  searchable?: InputMaybe<Scalars['Boolean']>;
  unique?: InputMaybe<Scalars['Boolean']>;
};

export type EntityFieldWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  customAttributes?: InputMaybe<StringFilter>;
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
  customAttributes?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  pluralDisplayName?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type EntityPermission = {
  action: EnumEntityAction;
  entityVersion?: Maybe<EntityVersion>;
  entityVersionId: Scalars['String'];
  id: Scalars['String'];
  permissionFields?: Maybe<Array<EntityPermissionField>>;
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
  type: EnumEntityPermissionType;
};

export type EntityPermissionField = {
  entityVersionId: Scalars['String'];
  field: EntityField;
  fieldPermanentId: Scalars['String'];
  id: Scalars['String'];
  permission?: Maybe<EntityPermission>;
  permissionId: Scalars['String'];
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
};

export type EntityPermissionFieldWhereUniqueInput = {
  action: EnumEntityAction;
  entityId: Scalars['String'];
  fieldPermanentId: Scalars['String'];
};

export type EntityPermissionRole = {
  action: EnumEntityAction;
  entityPermission?: Maybe<EntityPermission>;
  entityVersionId: Scalars['String'];
  id: Scalars['String'];
  resourceRole: ResourceRole;
  resourceRoleId: Scalars['String'];
};

export type EntityUpdateInput = {
  customAttributes?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  pluralDisplayName?: InputMaybe<Scalars['String']>;
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
  commit?: Maybe<Commit>;
  createdAt: Scalars['DateTime'];
  customAttributes?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  entity: Entity;
  entityId: Scalars['String'];
  fields: Array<EntityField>;
  id: Scalars['String'];
  name: Scalars['String'];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Int'];
};


export type EntityVersionFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntityFieldWhereInput>;
};

export type EntityVersionOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  customAttributes?: InputMaybe<SortOrder>;
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
  customAttributes?: InputMaybe<StringFilter>;
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
  customAttributes?: InputMaybe<StringFilter>;
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
  Debug = 'Debug',
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning'
}

export enum EnumActionStepStatus {
  Failed = 'Failed',
  Running = 'Running',
  Success = 'Success',
  Waiting = 'Waiting'
}

export enum EnumAuthProviderType {
  Http = 'Http',
  Jwt = 'Jwt'
}

export enum EnumBlockType {
  PluginInstallation = 'PluginInstallation',
  PluginOrder = 'PluginOrder',
  ProjectConfigurationSettings = 'ProjectConfigurationSettings',
  ServiceSettings = 'ServiceSettings',
  ServiceTopics = 'ServiceTopics',
  Topic = 'Topic'
}

export type EnumBlockTypeFilter = {
  equals?: InputMaybe<EnumBlockType>;
  in?: InputMaybe<Array<EnumBlockType>>;
  not?: InputMaybe<EnumBlockType>;
  notIn?: InputMaybe<Array<EnumBlockType>>;
};

export enum EnumBuildStatus {
  Completed = 'Completed',
  Failed = 'Failed',
  Invalid = 'Invalid',
  Running = 'Running'
}

export enum EnumDataType {
  Boolean = 'Boolean',
  CreatedAt = 'CreatedAt',
  DateTime = 'DateTime',
  DecimalNumber = 'DecimalNumber',
  Email = 'Email',
  GeographicLocation = 'GeographicLocation',
  Id = 'Id',
  Json = 'Json',
  Lookup = 'Lookup',
  MultiLineText = 'MultiLineText',
  MultiSelectOptionSet = 'MultiSelectOptionSet',
  OptionSet = 'OptionSet',
  Password = 'Password',
  Roles = 'Roles',
  SingleLineText = 'SingleLineText',
  UpdatedAt = 'UpdatedAt',
  Username = 'Username',
  WholeNumber = 'WholeNumber'
}

export type EnumDataTypeFilter = {
  equals?: InputMaybe<EnumDataType>;
  in?: InputMaybe<Array<EnumDataType>>;
  not?: InputMaybe<EnumDataType>;
  notIn?: InputMaybe<Array<EnumDataType>>;
};

export enum EnumEntityAction {
  Create = 'Create',
  Delete = 'Delete',
  Search = 'Search',
  Update = 'Update',
  View = 'View'
}

export enum EnumEntityPermissionType {
  AllRoles = 'AllRoles',
  Disabled = 'Disabled',
  Granular = 'Granular',
  Public = 'Public'
}

export enum EnumGitOrganizationType {
  Organization = 'Organization',
  User = 'User'
}

export enum EnumGitProvider {
  Bitbucket = 'Bitbucket',
  Github = 'Github'
}

export enum EnumMessagePatternConnectionOptions {
  None = 'None',
  Receive = 'Receive',
  Send = 'Send'
}

export enum EnumPendingChangeAction {
  Create = 'Create',
  Delete = 'Delete',
  Update = 'Update'
}

export enum EnumPendingChangeOriginType {
  Block = 'Block',
  Entity = 'Entity'
}

export enum EnumResourceType {
  MessageBroker = 'MessageBroker',
  ProjectConfiguration = 'ProjectConfiguration',
  Service = 'Service'
}

export type EnumResourceTypeFilter = {
  equals?: InputMaybe<EnumResourceType>;
  in?: InputMaybe<Array<EnumResourceType>>;
  not?: InputMaybe<EnumResourceType>;
  notIn?: InputMaybe<Array<EnumResourceType>>;
};

export enum EnumSubscriptionPlan {
  Enterprise = 'Enterprise',
  Free = 'Free',
  Pro = 'Pro'
}

export enum EnumSubscriptionStatus {
  Active = 'Active',
  Deleted = 'Deleted',
  PastDue = 'PastDue',
  Paused = 'Paused',
  Trailing = 'Trailing'
}

export enum EnumWorkspaceMemberType {
  Invitation = 'Invitation',
  User = 'User'
}

export type Environment = {
  address: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  resource: Resource;
  resourceId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type GitGetInstallationUrlInput = {
  gitProvider: EnumGitProvider;
};

/** Group of Repositories */
export type GitGroup = {
  displayName: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GitGroupInput = {
  organizationId: Scalars['String'];
};

export type GitOAuth2FlowInput = {
  code: Scalars['String'];
  gitProvider: EnumGitProvider;
};

export type GitOrganization = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  installationId: Scalars['String'];
  name: Scalars['String'];
  provider: EnumGitProvider;
  type: EnumGitOrganizationType;
  updatedAt: Scalars['DateTime'];
  /** Defines if a git organisation needs defined repository groups */
  useGroupingForRepositories: Scalars['Boolean'];
};

export type GitOrganizationCreateInput = {
  gitProvider: EnumGitProvider;
  installationId: Scalars['String'];
};

export type GitOrganizationWhereInput = {
  id?: InputMaybe<Scalars['String']>;
};

export type GitRepository = {
  createdAt?: Maybe<Scalars['DateTime']>;
  gitOrganization: GitOrganization;
  gitOrganizationId: Scalars['String'];
  groupName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type IBlock = {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  resourceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type Invitation = {
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['String'];
  invitedByUser?: Maybe<User>;
  updatedAt: Scalars['DateTime'];
  workspace?: Maybe<Workspace>;
};

export type InviteUserInput = {
  email: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MessagePattern = {
  topicId: Scalars['String'];
  type: EnumMessagePatternConnectionOptions;
};

export type MessagePatternCreateInput = {
  topicId: Scalars['String'];
  type: EnumMessagePatternConnectionOptions;
};

export type Mutation = {
  addEntityPermissionField: EntityPermissionField;
  changePassword: Account;
  commit?: Maybe<Commit>;
  completeGitOAuth2Flow: GitOrganization;
  completeInvitation: Auth;
  connectGitRepository: Resource;
  connectResourceGitRepository: Resource;
  connectResourceToProjectRepository: Resource;
  createApiToken: ApiToken;
  createBuild: Build;
  createDefaultEntities?: Maybe<Array<Entity>>;
  createDefaultRelatedField: EntityField;
  createEntityField: EntityField;
  createEntityFieldByDisplayName: EntityField;
  createMessageBroker: Resource;
  createOneEntity: Entity;
  /** Only for GitHub integrations */
  createOrganization: GitOrganization;
  createPluginInstallation: PluginInstallation;
  createProject: Project;
  createRemoteGitRepository: RemoteGitRepository;
  createResourceRole: ResourceRole;
  createService: Resource;
  createServiceTopics: ServiceTopics;
  createServiceWithEntities: ResourceCreateWithEntitiesResult;
  createTopic: Topic;
  createWorkspace?: Maybe<Workspace>;
  deleteApiToken: ApiToken;
  deleteEntity?: Maybe<Entity>;
  deleteEntityField: EntityField;
  deleteEntityPermissionField: EntityPermissionField;
  deleteGitOrganization: Scalars['Boolean'];
  deleteGitRepository: Resource;
  deletePluginInstallation: PluginInstallation;
  deleteProject?: Maybe<Project>;
  deleteResource?: Maybe<Resource>;
  deleteResourceRole?: Maybe<ResourceRole>;
  deleteServiceTopics: ServiceTopics;
  deleteTopic: Topic;
  deleteUser?: Maybe<User>;
  deleteWorkspace?: Maybe<Workspace>;
  discardPendingChanges?: Maybe<Scalars['Boolean']>;
  disconnectResourceGitRepository: Resource;
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
  inviteUser?: Maybe<Invitation>;
  lockEntity?: Maybe<Entity>;
  login: Auth;
  provisionSubscription?: Maybe<ProvisionSubscriptionResult>;
  resendInvitation?: Maybe<Invitation>;
  revokeInvitation?: Maybe<Invitation>;
  setCurrentWorkspace: Auth;
  setPluginOrder?: Maybe<PluginOrder>;
  signup: Auth;
  updateAccount: Account;
  updateEntity?: Maybe<Entity>;
  updateEntityField: EntityField;
  updateEntityPermission: EntityPermission;
  updateEntityPermissionFieldRoles: EntityPermissionField;
  updateEntityPermissionRoles: EntityPermission;
  updatePluginInstallation: PluginInstallation;
  updateProject: Project;
  updateProjectConfigurationSettings?: Maybe<ProjectConfigurationSettings>;
  updateResource?: Maybe<Resource>;
  updateResourceRole?: Maybe<ResourceRole>;
  updateServiceSettings?: Maybe<ServiceSettings>;
  updateServiceTopics: ServiceTopics;
  updateTopic: Topic;
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


export type MutationCompleteGitOAuth2FlowArgs = {
  data: GitOAuth2FlowInput;
};


export type MutationCompleteInvitationArgs = {
  data: CompleteInvitationInput;
};


export type MutationConnectGitRepositoryArgs = {
  data: CreateGitRepositoryInput;
};


export type MutationConnectResourceGitRepositoryArgs = {
  data: ConnectGitRepositoryInput;
};


export type MutationConnectResourceToProjectRepositoryArgs = {
  resourceId: Scalars['String'];
};


export type MutationCreateApiTokenArgs = {
  data: ApiTokenCreateInput;
};


export type MutationCreateBuildArgs = {
  data: BuildCreateInput;
};


export type MutationCreateDefaultEntitiesArgs = {
  data: DefaultEntitiesInput;
};


export type MutationCreateDefaultRelatedFieldArgs = {
  relatedFieldDisplayName?: InputMaybe<Scalars['String']>;
  relatedFieldName?: InputMaybe<Scalars['String']>;
  where: WhereUniqueInput;
};


export type MutationCreateEntityFieldArgs = {
  data: EntityFieldCreateInput;
  relatedFieldDisplayName?: InputMaybe<Scalars['String']>;
  relatedFieldName?: InputMaybe<Scalars['String']>;
};


export type MutationCreateEntityFieldByDisplayNameArgs = {
  data: EntityFieldCreateByDisplayNameInput;
};


export type MutationCreateMessageBrokerArgs = {
  data: ResourceCreateInput;
};


export type MutationCreateOneEntityArgs = {
  data: EntityCreateInput;
};


export type MutationCreateOrganizationArgs = {
  data: GitOrganizationCreateInput;
};


export type MutationCreatePluginInstallationArgs = {
  data: PluginInstallationCreateInput;
};


export type MutationCreateProjectArgs = {
  data: ProjectCreateInput;
};


export type MutationCreateRemoteGitRepositoryArgs = {
  data: CreateGitRepositoryBaseInput;
};


export type MutationCreateResourceRoleArgs = {
  data: ResourceRoleCreateInput;
};


export type MutationCreateServiceArgs = {
  data: ResourceCreateInput;
};


export type MutationCreateServiceTopicsArgs = {
  data: ServiceTopicsCreateInput;
};


export type MutationCreateServiceWithEntitiesArgs = {
  data: ResourceCreateWithEntitiesInput;
};


export type MutationCreateTopicArgs = {
  data: TopicCreateInput;
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
  gitOrganizationId: Scalars['String'];
  gitProvider: EnumGitProvider;
};


export type MutationDeleteGitRepositoryArgs = {
  gitRepositoryId: Scalars['String'];
};


export type MutationDeletePluginInstallationArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteProjectArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteResourceArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteResourceRoleArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteServiceTopicsArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteTopicArgs = {
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
  resourceId: Scalars['String'];
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


export type MutationProvisionSubscriptionArgs = {
  data: ProvisionSubscriptionInput;
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


export type MutationSetPluginOrderArgs = {
  data: PluginSetOrderInput;
  where: WhereUniqueInput;
};


export type MutationSignupArgs = {
  data: SignupInput;
};


export type MutationUpdateAccountArgs = {
  data: UpdateAccountInput;
};


export type MutationUpdateEntityArgs = {
  data: EntityUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateEntityFieldArgs = {
  data: EntityFieldUpdateInput;
  relatedFieldDisplayName?: InputMaybe<Scalars['String']>;
  relatedFieldName?: InputMaybe<Scalars['String']>;
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


export type MutationUpdatePluginInstallationArgs = {
  data: PluginInstallationUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateInput;
  where: WhereUniqueInput;
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


export type MutationUpdateServiceTopicsArgs = {
  data: ServiceTopicsUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateTopicArgs = {
  data: TopicUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateWorkspaceArgs = {
  data: WorkspaceUpdateInput;
  where: WhereUniqueInput;
};

/** Returns a paginated list of repository groups available to select. */
export type PaginatedGitGroup = {
  groups?: Maybe<Array<GitGroup>>;
  /** Page number */
  page: Scalars['Float'];
  /** Number of groups per page */
  pageSize: Scalars['Float'];
  /** Total number of groups */
  total: Scalars['Float'];
};

export type Pagination = {
  page: Scalars['Float'];
  perPage: Scalars['Float'];
};

export type PendingChange = {
  action: EnumPendingChangeAction;
  origin: PendingChangeOrigin;
  originId: Scalars['String'];
  originType: EnumPendingChangeOriginType;
  resource: Resource;
  versionNumber: Scalars['Int'];
};

export type PendingChangeOrigin = Block | Entity;

export type PendingChangesDiscardInput = {
  project: WhereParentIdInput;
};

export type PendingChangesFindInput = {
  project: WhereUniqueInput;
};

export type PluginInstallation = IBlock & {
  blockType: EnumBlockType;
  configurations?: Maybe<Scalars['JSONObject']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  npm: Scalars['String'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  pluginId: Scalars['String'];
  resourceId?: Maybe<Scalars['String']>;
  settings?: Maybe<Scalars['JSONObject']>;
  updatedAt: Scalars['DateTime'];
  version: Scalars['String'];
  versionNumber: Scalars['Float'];
};

export type PluginInstallationCreateInput = {
  configurations?: InputMaybe<Scalars['JSONObject']>;
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  enabled: Scalars['Boolean'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  npm: Scalars['String'];
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  pluginId: Scalars['String'];
  resource: WhereParentIdInput;
  settings?: InputMaybe<Scalars['JSONObject']>;
  version: Scalars['String'];
};

export type PluginInstallationOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type PluginInstallationUpdateInput = {
  configurations?: InputMaybe<Scalars['JSONObject']>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  settings?: InputMaybe<Scalars['JSONObject']>;
  version: Scalars['String'];
};

export type PluginInstallationWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PluginInstallationsCreateInput = {
  plugins?: InputMaybe<Array<PluginInstallationCreateInput>>;
};

export type PluginOrder = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  order: Array<PluginOrderItem>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  resourceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type PluginOrderItem = {
  order: Scalars['Int'];
  pluginId: Scalars['String'];
};

export type PluginSetOrderInput = {
  order: Scalars['Int'];
};

export type Project = {
  createdAt: Scalars['DateTime'];
  demoRepoName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  resources?: Maybe<Array<Resource>>;
  updatedAt: Scalars['DateTime'];
  useDemoRepo: Scalars['Boolean'];
};

export type ProjectConfigurationSettings = IBlock & {
  baseDirectory: Scalars['String'];
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  resourceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type ProjectConfigurationSettingsUpdateInput = {
  baseDirectory?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
};

export type ProjectCreateInput = {
  name: Scalars['String'];
};

export type ProjectOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type ProjectUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type ProjectWhereInput = {
  deletedAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<StringFilter>;
  resources?: InputMaybe<ResourceListRelationFilter>;
};

export type PropertySelector = {
  include: Scalars['Boolean'];
  propertyName: Scalars['String'];
};

export type PropertySelectorInput = {
  include: Scalars['Boolean'];
  propertyName: Scalars['String'];
};

export type ProvisionSubscriptionInput = {
  billingPeriod: Scalars['String'];
  cancelUrl?: InputMaybe<Scalars['String']>;
  intentionType: Scalars['String'];
  planId: Scalars['String'];
  successUrl?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['String'];
};

export type ProvisionSubscriptionResult = {
  checkoutUrl?: Maybe<Scalars['String']>;
  provisionStatus: Scalars['String'];
};

export type Query = {
  PluginInstallation?: Maybe<PluginInstallation>;
  PluginInstallations: Array<PluginInstallation>;
  ServiceTopics?: Maybe<ServiceTopics>;
  ServiceTopicsList: Array<ServiceTopics>;
  Topic?: Maybe<Topic>;
  Topics: Array<Topic>;
  account: Account;
  action: Action;
  block: Block;
  blocks: Array<Block>;
  build: Build;
  builds: Array<Build>;
  commit?: Maybe<Commit>;
  commits?: Maybe<Array<Commit>>;
  currentWorkspace?: Maybe<Workspace>;
  entities: Array<Entity>;
  entity?: Maybe<Entity>;
  gitGroups: PaginatedGitGroup;
  gitOrganization: GitOrganization;
  gitOrganizations: Array<GitOrganization>;
  me: User;
  messageBrokerConnectedServices: Array<Resource>;
  pendingChanges: Array<PendingChange>;
  pluginOrder: PluginOrder;
  project?: Maybe<Project>;
  projectConfigurationSettings: ProjectConfigurationSettings;
  projects: Array<Project>;
  remoteGitRepositories: RemoteGitRepos;
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


export type QueryPluginInstallationArgs = {
  where: WhereUniqueInput;
};


export type QueryPluginInstallationsArgs = {
  orderBy?: InputMaybe<PluginInstallationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PluginInstallationWhereInput>;
};


export type QueryServiceTopicsArgs = {
  where: WhereUniqueInput;
};


export type QueryServiceTopicsListArgs = {
  orderBy?: InputMaybe<ServiceTopicsOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ServiceTopicsWhereInput>;
};


export type QueryTopicArgs = {
  where: WhereUniqueInput;
};


export type QueryTopicsArgs = {
  orderBy?: InputMaybe<TopicOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TopicWhereInput>;
};


export type QueryActionArgs = {
  where: WhereUniqueInput;
};


export type QueryBlockArgs = {
  where: WhereUniqueInput;
};


export type QueryBlocksArgs = {
  orderBy?: InputMaybe<BlockOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryBuildArgs = {
  where: WhereUniqueInput;
};


export type QueryBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BuildWhereInput>;
};


export type QueryCommitArgs = {
  where: CommitWhereUniqueInput;
};


export type QueryCommitsArgs = {
  cursor?: InputMaybe<CommitWhereUniqueInput>;
  orderBy?: InputMaybe<CommitOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CommitWhereInput>;
};


export type QueryEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntityWhereInput>;
};


export type QueryEntityArgs = {
  where: WhereUniqueInput;
};


export type QueryGitGroupsArgs = {
  where: GitGroupInput;
};


export type QueryGitOrganizationArgs = {
  where: WhereUniqueInput;
};


export type QueryGitOrganizationsArgs = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
  where?: InputMaybe<GitOrganizationWhereInput>;
};


export type QueryMessageBrokerConnectedServicesArgs = {
  where: WhereUniqueInput;
};


export type QueryPendingChangesArgs = {
  where: PendingChangesFindInput;
};


export type QueryPluginOrderArgs = {
  where: WhereUniqueInput;
};


export type QueryProjectArgs = {
  where: WhereUniqueInput;
};


export type QueryProjectConfigurationSettingsArgs = {
  where: WhereUniqueInput;
};


export type QueryProjectsArgs = {
  orderBy?: InputMaybe<ProjectOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProjectWhereInput>;
};


export type QueryRemoteGitRepositoriesArgs = {
  where: RemoteGitRepositoriesWhereUniqueInput;
};


export type QueryResourceArgs = {
  where: WhereUniqueInput;
};


export type QueryResourceRoleArgs = {
  version?: InputMaybe<Scalars['Float']>;
  where: WhereUniqueInput;
};


export type QueryResourceRolesArgs = {
  orderBy?: InputMaybe<ResourceRoleOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResourceRoleWhereInput>;
};


export type QueryResourcesArgs = {
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResourceWhereInput>;
};


export type QueryServiceSettingsArgs = {
  where: WhereUniqueInput;
};


export type QueryWorkspaceArgs = {
  where: WhereUniqueInput;
};

export enum QueryMode {
  Default = 'Default',
  Insensitive = 'Insensitive'
}

export type RemoteGitRepos = {
  pagination: Pagination;
  repos: Array<RemoteGitRepository>;
  total: Scalars['Float'];
};

export type RemoteGitRepositoriesWhereUniqueInput = {
  gitOrganizationId: Scalars['String'];
  gitProvider: EnumGitProvider;
  groupName?: InputMaybe<Scalars['String']>;
  /** The page number. One-based indexing */
  page?: Scalars['Float'];
  /** The number of items to return per page */
  perPage?: Scalars['Float'];
};

export type RemoteGitRepository = {
  admin: Scalars['Boolean'];
  defaultBranch: Scalars['String'];
  fullName: Scalars['String'];
  groupName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  private: Scalars['Boolean'];
  url: Scalars['String'];
};

export type Resource = {
  builds: Array<Build>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  entities: Array<Entity>;
  environments: Array<Environment>;
  gitRepository?: Maybe<GitRepository>;
  gitRepositoryId?: Maybe<Scalars['String']>;
  gitRepositoryOverride: Scalars['Boolean'];
  githubLastMessage?: Maybe<Scalars['String']>;
  githubLastSync?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars['String']>;
  resourceType: EnumResourceType;
  updatedAt: Scalars['DateTime'];
};


export type ResourceBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BuildWhereInput>;
};


export type ResourceEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntityWhereInput>;
};

export type ResourceCreateInput = {
  description: Scalars['String'];
  gitRepository?: InputMaybe<ConnectGitRepositoryInput>;
  name: Scalars['String'];
  project: WhereParentIdInput;
  resourceType: EnumResourceType;
  serviceSettings?: InputMaybe<ServiceSettingsUpdateInput>;
};

export type ResourceCreateWithEntitiesEntityInput = {
  fields: Array<ResourceCreateWithEntitiesFieldInput>;
  name: Scalars['String'];
  relationsToEntityIndex?: InputMaybe<Array<Scalars['Int']>>;
};

export type ResourceCreateWithEntitiesFieldInput = {
  dataType?: InputMaybe<EnumDataType>;
  name: Scalars['String'];
};

export type ResourceCreateWithEntitiesInput = {
  authType: Scalars['String'];
  commitMessage: Scalars['String'];
  connectToDemoRepo: Scalars['Boolean'];
  dbType: Scalars['String'];
  entities: Array<ResourceCreateWithEntitiesEntityInput>;
  plugins?: InputMaybe<PluginInstallationsCreateInput>;
  repoType: Scalars['String'];
  resource: ResourceCreateInput;
  wizardType: Scalars['String'];
};

export type ResourceCreateWithEntitiesResult = {
  build?: Maybe<Build>;
  resource: Resource;
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
  resourceType?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ResourceRole = {
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ResourceRoleCreateInput = {
  description: Scalars['String'];
  displayName: Scalars['String'];
  name: Scalars['String'];
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
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};

export type ResourceRoleWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<StringFilter>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ResourceUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  gitRepositoryOverride?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ResourceWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<StringFilter>;
  project?: InputMaybe<ProjectWhereInput>;
  projectId?: InputMaybe<Scalars['String']>;
  resourceType?: InputMaybe<EnumResourceTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum Role {
  Admin = 'Admin',
  OrganizationAdmin = 'OrganizationAdmin',
  ProjectAdmin = 'ProjectAdmin',
  User = 'User'
}

export type ServerSettings = {
  generateGraphQL: Scalars['Boolean'];
  generateRestApi: Scalars['Boolean'];
  serverPath: Scalars['String'];
};

export type ServerSettingsUpdateInput = {
  generateGraphQL?: InputMaybe<Scalars['Boolean']>;
  generateRestApi?: InputMaybe<Scalars['Boolean']>;
  serverPath?: InputMaybe<Scalars['String']>;
};

export type ServiceSettings = IBlock & {
  adminUISettings: AdminUiSettings;
  authProvider: EnumAuthProviderType;
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  resourceId?: Maybe<Scalars['String']>;
  serverSettings: ServerSettings;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type ServiceSettingsUpdateInput = {
  adminUISettings: AdminUiSettingsUpdateInput;
  authProvider: EnumAuthProviderType;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  serverSettings: ServerSettingsUpdateInput;
};

export type ServiceTopics = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  messageBrokerId: Scalars['String'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  patterns: Array<MessagePattern>;
  resourceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type ServiceTopicsCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  enabled: Scalars['Boolean'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  messageBrokerId: Scalars['String'];
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  patterns?: InputMaybe<Array<MessagePatternCreateInput>>;
  resource: WhereParentIdInput;
};

export type ServiceTopicsOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ServiceTopicsUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  messageBrokerId: Scalars['String'];
  patterns?: InputMaybe<Array<MessagePatternCreateInput>>;
};

export type ServiceTopicsWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SignupInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  workspaceName: Scalars['String'];
};

export enum SortOrder {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type Subscription = {
  cancelUrl?: Maybe<Scalars['String']>;
  cancellationEffectiveDate?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  nextBillDate?: Maybe<Scalars['DateTime']>;
  price?: Maybe<Scalars['Float']>;
  status: EnumSubscriptionStatus;
  subscriptionPlan: EnumSubscriptionPlan;
  updateUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars['String'];
};

export type Topic = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName: Scalars['String'];
  id: Scalars['String'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']>;
  lockedByUserId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  resourceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  versionNumber: Scalars['Float'];
};

export type TopicCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  name?: InputMaybe<Scalars['String']>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
};

export type TopicOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type TopicUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type TopicWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UpdateAccountInput = {
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
};

export type User = {
  account?: Maybe<Account>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  isOwner: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  userRoles?: Maybe<Array<UserRole>>;
  workspace?: Maybe<Workspace>;
};

export type UserRole = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  role: Role;
  updatedAt: Scalars['DateTime'];
};

export type WhereParentIdInput = {
  connect: WhereUniqueInput;
};

export type WhereUniqueInput = {
  id: Scalars['String'];
};

export type Workspace = {
  createdAt: Scalars['DateTime'];
  gitOrganizations?: Maybe<Array<GitOrganization>>;
  id: Scalars['String'];
  name: Scalars['String'];
  projects: Array<Project>;
  subscription?: Maybe<Subscription>;
  updatedAt: Scalars['DateTime'];
  users: Array<User>;
};

export type WorkspaceCreateInput = {
  name: Scalars['String'];
};

export type WorkspaceMember = {
  member: WorkspaceMemberType;
  type: EnumWorkspaceMemberType;
};

export type WorkspaceMemberType = Invitation | User;

export type WorkspaceUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
};
