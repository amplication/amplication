import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Account = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  githubId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  previewAccountEmail?: Maybe<Scalars['String']['output']>;
  previewAccountType: EnumPreviewAccountType;
  updatedAt: Scalars['DateTime']['output'];
};

export type Action = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  steps?: Maybe<Array<ActionStep>>;
};

export type ActionLog = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  level: EnumActionLogLevel;
  message: Scalars['String']['output'];
  meta: Scalars['JSONObject']['output'];
};

export type ActionStep = {
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  logs?: Maybe<Array<ActionLog>>;
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: EnumActionStepStatus;
};

export type AdminUiSettings = {
  adminUIPath: Scalars['String']['output'];
  generateAdminUI: Scalars['Boolean']['output'];
};

export type AdminUiSettingsUpdateInput = {
  adminUIPath?: InputMaybe<Scalars['String']['input']>;
  generateAdminUI?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ApiToken = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastAccessAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  previewChars: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type ApiTokenCreateInput = {
  name: Scalars['String']['input'];
};

export type AssistantContext = {
  projectId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
};

export type AssistantMessage = {
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  role: EnumAssistantMessageRole;
  text: Scalars['String']['output'];
};

export type AssistantMessageDelta = {
  completed: Scalars['Boolean']['output'];
  functionExecuted?: Maybe<EnumAssistantFunctions>;
  id: Scalars['String']['output'];
  snapshot: Scalars['String']['output'];
  text: Scalars['String']['output'];
  threadId: Scalars['String']['output'];
};

export type AssistantThread = {
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  messages?: Maybe<Array<AssistantMessage>>;
  updatedAt: Scalars['String']['output'];
};

export type Auth = {
  /** JWT Bearer token */
  token: Scalars['String']['output'];
};

export type AuthPreviewAccount = {
  projectId: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  workspaceId: Scalars['String']['output'];
};

export type AuthorizeResourceWithGitResult = {
  url: Scalars['String']['output'];
};

export type Block = {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser: User;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  parentBlock?: Maybe<Block>;
  resource?: Maybe<Resource>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber?: Maybe<Scalars['Float']['output']>;
  versions?: Maybe<Array<BlockVersion>>;
};


export type BlockVersionsArgs = {
  orderBy?: InputMaybe<BlockVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BlockVersionWhereInput>;
};

export type BlockInputOutput = {
  dataType?: Maybe<EnumDataType>;
  dataTypeEntityName?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  includeAllPropertiesByDefault?: Maybe<Scalars['Boolean']['output']>;
  isList?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  propertyList?: Maybe<Array<PropertySelector>>;
};

export type BlockInputOutputInput = {
  dataType?: InputMaybe<EnumDataType>;
  dataTypeEntityName?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  includeAllPropertiesByDefault?: InputMaybe<Scalars['Boolean']['input']>;
  isList?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
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
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  settings?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Int']['output'];
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

export type Blueprint = {
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Array<CustomProperty>>;
  relations?: Maybe<Array<BlueprintRelation>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BlueprintCreateInput = {
  name: Scalars['String']['input'];
};

export type BlueprintOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type BlueprintRelation = {
  allowMultiple: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  relatedTo: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type BlueprintRelationUpsertInput = {
  allowMultiple: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  relatedTo: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
};

export type BlueprintUpdateInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type BlueprintWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BreakServiceToMicroservicesData = {
  microservices: Array<BreakServiceToMicroservicesItem>;
};

export type BreakServiceToMicroservicesItem = {
  functionality: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tables: Array<BreakServiceToMicroservicesItemEntities>;
};

export type BreakServiceToMicroservicesItemEntities = {
  name: Scalars['String']['output'];
  originalEntityId: Scalars['String']['output'];
};

export type BreakServiceToMicroservicesResult = {
  /** Prompt result with some data structure manipulation */
  data?: Maybe<BreakServiceToMicroservicesData>;
  /** The original resource ID */
  originalResourceId: Scalars['String']['output'];
  /** The status of the user action */
  status: EnumUserActionStatus;
};

export type Build = {
  action?: Maybe<Action>;
  actionId: Scalars['String']['output'];
  archiveURI?: Maybe<Scalars['String']['output']>;
  buildPlugins: Array<BuildPlugin>;
  codeGeneratorVersion?: Maybe<Scalars['String']['output']>;
  commit?: Maybe<Commit>;
  commitId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<User>;
  filesChanged?: Maybe<Scalars['Float']['output']>;
  gitStatus: EnumBuildGitStatus;
  id: Scalars['String']['output'];
  linesOfCodeAdded?: Maybe<Scalars['Float']['output']>;
  linesOfCodeDeleted?: Maybe<Scalars['Float']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Resource>;
  resourceId: Scalars['String']['output'];
  status: EnumBuildStatus;
  userId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type BuildOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type BuildPlugin = {
  build?: Maybe<Build>;
  buildId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  packageName: Scalars['String']['output'];
  packageVersion: Scalars['String']['output'];
  requestedFullPackageName: Scalars['String']['output'];
};

export type BuildWhereInput = {
  commit?: InputMaybe<WhereUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<WhereUniqueInput>;
  gitStatus?: InputMaybe<EnumBuildGitStatusFilter>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  resource?: InputMaybe<WhereUniqueInput>;
  status?: InputMaybe<EnumBuildStatusFilter>;
  version?: InputMaybe<StringFilter>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type CodeGeneratorVersionOptionsInput = {
  codeGeneratorStrategy?: InputMaybe<CodeGeneratorVersionStrategy>;
  codeGeneratorVersion?: InputMaybe<Scalars['String']['input']>;
};

export enum CodeGeneratorVersionStrategy {
  LatestMajor = 'LatestMajor',
  LatestMinor = 'LatestMinor',
  Specific = 'Specific'
}

export type CodeGeneratorVersionUpdateInput = {
  codeGeneratorVersionOptions: CodeGeneratorVersionOptionsInput;
};

export type Commit = {
  builds?: Maybe<Array<Build>>;
  changes?: Maybe<Array<PendingChange>>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};


export type CommitBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BuildWhereInput>;
};

export type CommitCreateInput = {
  /** It will bypass the limitations of the plan (if any). It will only work for limitation that support commit bypass. */
  bypassLimitations?: InputMaybe<Scalars['Boolean']['input']>;
  /** The strategy to use when committing the changes. If not provided, the default strategy will be used. */
  commitStrategy?: InputMaybe<EnumCommitStrategy>;
  message: Scalars['String']['input'];
  project: WhereParentIdInput;
  /** The resources to commit, when strategy is "Specific". On other strategies, this field will be ignored. */
  resourceIds?: InputMaybe<Array<Scalars['String']['input']>>;
  resourceTypeGroup: EnumResourceTypeGroup;
  resourceVersions?: InputMaybe<Array<CommitResourceVersionCreateInput>>;
};

export type CommitOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
};

export type CommitResourceVersionCreateInput = {
  resourceId?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type CommitWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  project: WhereUniqueInput;
  resourceTypeGroup: EnumResourceTypeGroup;
  user?: InputMaybe<WhereUniqueInput>;
};

export type CommitWhereUniqueInput = {
  id: Scalars['String']['input'];
};

export type CompareResourceVersionsWhereInput = {
  resource: WhereUniqueInput;
  sourceVersion: Scalars['String']['input'];
  targetVersion: Scalars['String']['input'];
};

export type CompleteInvitationInput = {
  token: Scalars['String']['input'];
};

export type ConnectGitRepositoryInput = {
  gitOrganizationId: Scalars['String']['input'];
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']['input']>;
  isOverrideGitRepository?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
};

export type Coupon = {
  code: Scalars['String']['output'];
  couponType?: Maybe<Scalars['String']['output']>;
  durationMonths: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  subscriptionPlan: EnumSubscriptionPlan;
};

export type CreateEntitiesFromPredefinedSchemaInput = {
  resource: WhereParentIdInput;
  schemaName: EnumSchemaNames;
};

export type CreateGitRepositoryBaseInput = {
  gitOrganizationId: Scalars['String']['input'];
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']['input']>;
  isPublic: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type CreateGitRepositoryInput = {
  gitOrganizationId: Scalars['String']['input'];
  gitOrganizationType: EnumGitOrganizationType;
  gitProvider: EnumGitProvider;
  /** Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true */
  groupName?: InputMaybe<Scalars['String']['input']>;
  isPublic: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  resourceId?: InputMaybe<Scalars['String']['input']>;
};

export type CustomProperty = {
  blueprint?: Maybe<Scalars['String']['output']>;
  blueprintId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<CustomPropertyOption>>;
  type: EnumCustomPropertyType;
  updatedAt: Scalars['DateTime']['output'];
};

export type CustomPropertyCreateInput = {
  blueprint?: InputMaybe<WhereParentIdInput>;
  name: Scalars['String']['input'];
};

export type CustomPropertyOption = {
  color: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CustomPropertyOptionCreateInput = {
  customProperty: WhereParentIdInput;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CustomPropertyOptionUpdateInput = {
  color: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CustomPropertyOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type CustomPropertyUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<EnumCustomPropertyType>;
};

export type CustomPropertyWhereInput = {
  blueprint?: InputMaybe<BlueprintWhereInput>;
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
};

export type DbSchemaImportCreateInput = {
  resource: WhereParentIdInput;
  userActionType: EnumUserActionType;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DefaultEntitiesInput = {
  resourceId: Scalars['String']['input'];
};

export type Entity = {
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  fields?: Maybe<Array<EntityField>>;
  id: Scalars['String']['output'];
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars['String']['output'];
  resource?: Maybe<Resource>;
  resourceId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  versions?: Maybe<Array<EntityVersion>>;
};


export type EntityFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EntityFieldWhereInput>;
};


export type EntityVersionsArgs = {
  orderBy?: InputMaybe<EntityVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EntityVersionWhereInput>;
};

export type EntityAddPermissionFieldInput = {
  action: EnumEntityAction;
  entity: WhereParentIdInput;
  fieldName: Scalars['String']['input'];
};

export type EntityCreateInput = {
  customAttributes?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  /** allow creating the id for the entity when using import prisma schema because we need it for the relation */
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pluralDisplayName: Scalars['String']['input'];
  resource: WhereParentIdInput;
};

export type EntityField = {
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Scalars['String']['output']>;
  dataType: EnumDataType;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permanentId: Scalars['String']['output'];
  position?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSONObject']['output']>;
  required: Scalars['Boolean']['output'];
  searchable: Scalars['Boolean']['output'];
  unique: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EntityFieldCreateByDisplayNameInput = {
  dataType?: InputMaybe<EnumDataType>;
  displayName: Scalars['String']['input'];
  entity: WhereParentIdInput;
};

export type EntityFieldCreateInput = {
  customAttributes?: InputMaybe<Scalars['String']['input']>;
  dataType: EnumDataType;
  description: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  entity: WhereParentIdInput;
  name: Scalars['String']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  properties: Scalars['JSONObject']['input'];
  required: Scalars['Boolean']['input'];
  searchable: Scalars['Boolean']['input'];
  unique: Scalars['Boolean']['input'];
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
  customAttributes?: InputMaybe<Scalars['String']['input']>;
  dataType?: InputMaybe<EnumDataType>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<Scalars['JSONObject']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  searchable?: InputMaybe<Scalars['Boolean']['input']>;
  unique?: InputMaybe<Scalars['Boolean']['input']>;
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
  entityVersionId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  permissionFields?: Maybe<Array<EntityPermissionField>>;
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
  type: EnumEntityPermissionType;
};

export type EntityPermissionField = {
  entityVersionId: Scalars['String']['output'];
  field: EntityField;
  fieldPermanentId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  permission?: Maybe<EntityPermission>;
  permissionId: Scalars['String']['output'];
  permissionRoles?: Maybe<Array<EntityPermissionRole>>;
};

export type EntityPermissionFieldWhereUniqueInput = {
  action: EnumEntityAction;
  entityId: Scalars['String']['input'];
  fieldPermanentId: Scalars['String']['input'];
};

export type EntityPermissionRole = {
  action: EnumEntityAction;
  entityPermission?: Maybe<EntityPermission>;
  entityVersionId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  resourceRole: ResourceRole;
  resourceRoleId: Scalars['String']['output'];
};

export type EntityUpdateInput = {
  customAttributes?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pluralDisplayName?: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  entity: Entity;
  entityId: Scalars['String']['output'];
  fields: Array<EntityField>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralDisplayName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Int']['output'];
};


export type EntityVersionFieldsArgs = {
  orderBy?: InputMaybe<EntityFieldOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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

export enum EnumAssistantFunctions {
  CommitProjectPendingChanges = 'CommitProjectPendingChanges',
  CreateEntities = 'CreateEntities',
  CreateEntityFields = 'CreateEntityFields',
  CreateModule = 'CreateModule',
  CreateModuleAction = 'CreateModuleAction',
  CreateModuleDto = 'CreateModuleDto',
  CreateModuleEnum = 'CreateModuleEnum',
  CreateProject = 'CreateProject',
  CreateService = 'CreateService',
  GetModuleActions = 'GetModuleActions',
  GetModuleDtosAndEnums = 'GetModuleDtosAndEnums',
  GetPlugins = 'GetPlugins',
  GetProjectPendingChanges = 'GetProjectPendingChanges',
  GetProjectServices = 'GetProjectServices',
  GetService = 'GetService',
  GetServiceEntities = 'GetServiceEntities',
  GetServiceModules = 'GetServiceModules',
  InstallPlugins = 'InstallPlugins'
}

export enum EnumAssistantMessageRole {
  Assistant = 'Assistant',
  User = 'User'
}

export enum EnumAssistantMessageType {
  Default = 'Default',
  Onboarding = 'Onboarding'
}

export enum EnumAuthProviderType {
  Auth0 = 'Auth0',
  Http = 'Http',
  Jwt = 'Jwt'
}

export enum EnumBlockType {
  CodeEngineVersion = 'CodeEngineVersion',
  Module = 'Module',
  ModuleAction = 'ModuleAction',
  ModuleDto = 'ModuleDto',
  Package = 'Package',
  PluginInstallation = 'PluginInstallation',
  PluginOrder = 'PluginOrder',
  PrivatePlugin = 'PrivatePlugin',
  ProjectConfigurationSettings = 'ProjectConfigurationSettings',
  Relation = 'Relation',
  ResourceSettings = 'ResourceSettings',
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

export enum EnumBuildGitStatus {
  Canceled = 'Canceled',
  Completed = 'Completed',
  Failed = 'Failed',
  NotConnected = 'NotConnected',
  Unknown = 'Unknown',
  Waiting = 'Waiting'
}

export type EnumBuildGitStatusFilter = {
  equals?: InputMaybe<EnumBuildGitStatus>;
  in?: InputMaybe<Array<EnumBuildGitStatus>>;
  not?: InputMaybe<EnumBuildGitStatus>;
  notIn?: InputMaybe<Array<EnumBuildGitStatus>>;
};

export enum EnumBuildStatus {
  Canceled = 'Canceled',
  Completed = 'Completed',
  Failed = 'Failed',
  Invalid = 'Invalid',
  Running = 'Running',
  Unknown = 'Unknown'
}

export type EnumBuildStatusFilter = {
  equals?: InputMaybe<EnumBuildStatus>;
  in?: InputMaybe<Array<EnumBuildStatus>>;
  not?: InputMaybe<EnumBuildStatus>;
  notIn?: InputMaybe<Array<EnumBuildStatus>>;
};

export enum EnumCodeGenerator {
  Blueprint = 'Blueprint',
  DotNet = 'DotNet',
  NodeJs = 'NodeJs'
}

export type EnumCodeGeneratorFilter = {
  equals?: InputMaybe<EnumCodeGenerator>;
};

export enum EnumCommitStrategy {
  All = 'All',
  AllWithPendingChanges = 'AllWithPendingChanges',
  Specific = 'Specific'
}

export enum EnumCustomPropertyType {
  Link = 'Link',
  MultiSelect = 'MultiSelect',
  Select = 'Select',
  Text = 'Text'
}

export enum EnumDataType {
  Boolean = 'Boolean',
  CreatedAt = 'CreatedAt',
  DateTime = 'DateTime',
  DecimalNumber = 'DecimalNumber',
  Email = 'Email',
  File = 'File',
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

export enum EnumGitFolderContentItemType {
  Dir = 'Dir',
  File = 'File',
  Other = 'Other'
}

export enum EnumGitOrganizationType {
  Organization = 'Organization',
  User = 'User'
}

export enum EnumGitProvider {
  AwsCodeCommit = 'AwsCodeCommit',
  AzureDevOps = 'AzureDevOps',
  Bitbucket = 'Bitbucket',
  GitLab = 'GitLab',
  Github = 'Github'
}

export enum EnumMessagePatternConnectionOptions {
  None = 'None',
  Receive = 'Receive',
  Send = 'Send'
}

export enum EnumModuleActionGqlOperation {
  Mutation = 'Mutation',
  Query = 'Query'
}

export enum EnumModuleActionRestInputSource {
  Body = 'Body',
  Params = 'Params',
  Query = 'Query',
  Split = 'Split'
}

export enum EnumModuleActionRestVerb {
  Delete = 'Delete',
  Get = 'Get',
  Head = 'Head',
  Options = 'Options',
  Patch = 'Patch',
  Post = 'Post',
  Put = 'Put',
  Trace = 'Trace'
}

export enum EnumModuleActionType {
  ChildrenConnect = 'ChildrenConnect',
  ChildrenDisconnect = 'ChildrenDisconnect',
  ChildrenFind = 'ChildrenFind',
  ChildrenUpdate = 'ChildrenUpdate',
  Create = 'Create',
  Custom = 'Custom',
  Delete = 'Delete',
  Find = 'Find',
  Meta = 'Meta',
  ParentGet = 'ParentGet',
  Read = 'Read',
  Update = 'Update'
}

export enum EnumModuleDtoPropertyType {
  Boolean = 'Boolean',
  DateTime = 'DateTime',
  Dto = 'Dto',
  Enum = 'Enum',
  Float = 'Float',
  Integer = 'Integer',
  Json = 'Json',
  Null = 'Null',
  String = 'String',
  Undefined = 'Undefined'
}

export enum EnumModuleDtoType {
  CountArgs = 'CountArgs',
  CreateArgs = 'CreateArgs',
  CreateInput = 'CreateInput',
  CreateNestedManyInput = 'CreateNestedManyInput',
  Custom = 'Custom',
  CustomEnum = 'CustomEnum',
  DeleteArgs = 'DeleteArgs',
  Entity = 'Entity',
  Enum = 'Enum',
  FindManyArgs = 'FindManyArgs',
  FindOneArgs = 'FindOneArgs',
  ListRelationFilter = 'ListRelationFilter',
  OrderByInput = 'OrderByInput',
  UpdateArgs = 'UpdateArgs',
  UpdateInput = 'UpdateInput',
  UpdateNestedManyInput = 'UpdateNestedManyInput',
  WhereInput = 'WhereInput',
  WhereUniqueInput = 'WhereUniqueInput'
}

export enum EnumOutdatedVersionAlertStatus {
  Canceled = 'Canceled',
  Ignored = 'Ignored',
  New = 'New',
  Resolved = 'Resolved'
}

export type EnumOutdatedVersionAlertStatusFilter = {
  equals?: InputMaybe<EnumOutdatedVersionAlertStatus>;
  in?: InputMaybe<Array<EnumOutdatedVersionAlertStatus>>;
  not?: InputMaybe<EnumOutdatedVersionAlertStatus>;
  notIn?: InputMaybe<Array<EnumOutdatedVersionAlertStatus>>;
};

export enum EnumOutdatedVersionAlertType {
  CodeEngineVersion = 'CodeEngineVersion',
  PluginVersion = 'PluginVersion',
  TemplateVersion = 'TemplateVersion'
}

export type EnumOutdatedVersionAlertTypeFilter = {
  equals?: InputMaybe<EnumOutdatedVersionAlertType>;
  in?: InputMaybe<Array<EnumOutdatedVersionAlertType>>;
  not?: InputMaybe<EnumOutdatedVersionAlertType>;
  notIn?: InputMaybe<Array<EnumOutdatedVersionAlertType>>;
};

export enum EnumPackageStatus {
  Completed = 'Completed',
  Failed = 'Failed',
  Initial = 'Initial'
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

export enum EnumPreviewAccountType {
  BreakingTheMonolith = 'BreakingTheMonolith',
  None = 'None',
  PreviewOnboarding = 'PreviewOnboarding'
}

export enum EnumResourceType {
  Component = 'Component',
  MessageBroker = 'MessageBroker',
  PluginRepository = 'PluginRepository',
  ProjectConfiguration = 'ProjectConfiguration',
  Service = 'Service',
  ServiceTemplate = 'ServiceTemplate'
}

export type EnumResourceTypeFilter = {
  equals?: InputMaybe<EnumResourceType>;
  in?: InputMaybe<Array<EnumResourceType>>;
  not?: InputMaybe<EnumResourceType>;
  notIn?: InputMaybe<Array<EnumResourceType>>;
};

export enum EnumResourceTypeGroup {
  Platform = 'Platform',
  Services = 'Services'
}

export enum EnumSchemaNames {
  Abby = 'Abby',
  CalDotCom = 'CalDotCom',
  Formbricks = 'Formbricks',
  Papermark = 'Papermark'
}

export enum EnumSubscriptionPlan {
  Enterprise = 'Enterprise',
  Essential = 'Essential',
  Free = 'Free',
  PreviewBreakTheMonolith = 'PreviewBreakTheMonolith',
  Pro = 'Pro',
  Team = 'Team'
}

export enum EnumSubscriptionStatus {
  Active = 'Active',
  Deleted = 'Deleted',
  PastDue = 'PastDue',
  Paused = 'Paused',
  Trailing = 'Trailing'
}

export enum EnumTimeGroup {
  Day = 'Day',
  Month = 'Month',
  Week = 'Week',
  Year = 'Year'
}

export enum EnumUserActionStatus {
  Completed = 'Completed',
  Failed = 'Failed',
  Invalid = 'Invalid',
  Running = 'Running'
}

export enum EnumUserActionType {
  DbSchemaImport = 'DBSchemaImport',
  GptConversation = 'GptConversation',
  ProjectRedesign = 'ProjectRedesign'
}

export enum EnumWorkspaceMemberType {
  Invitation = 'Invitation',
  User = 'User'
}

export type Environment = {
  address: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  resource: Resource;
  resourceId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EvaluationInsights = {
  codeQuality: Scalars['Int']['output'];
  costSaved: Scalars['Int']['output'];
  loc: Scalars['Int']['output'];
  timeSaved: Scalars['Int']['output'];
};

export type GitFolderContent = {
  content: Array<GitFolderContentItem>;
};

export type GitFolderContentItem = {
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  type: EnumGitFolderContentItemType;
};

export type GitGetInstallationUrlInput = {
  gitProvider: EnumGitProvider;
  state?: InputMaybe<Scalars['String']['input']>;
};

/** Group of Repositories */
export type GitGroup = {
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GitGroupInput = {
  organizationId: Scalars['String']['input'];
};

export type GitOAuth2FlowInput = {
  code: Scalars['String']['input'];
  gitProvider: EnumGitProvider;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type GitOrganization = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  installationId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  provider: EnumGitProvider;
  type: EnumGitOrganizationType;
  updatedAt: Scalars['DateTime']['output'];
  /** Defines if a git organisation needs defined repository groups */
  useGroupingForRepositories: Scalars['Boolean']['output'];
};

export type GitOrganizationCreateInput = {
  awsCodeCommitInput?: InputMaybe<GitOrganizationCreateInputAwsCodeCommit>;
  gitProvider: EnumGitProvider;
  githubInput?: InputMaybe<GitOrganizationCreateInputGitHub>;
};

export type GitOrganizationCreateInputAwsCodeCommit = {
  /** AWS access key ID */
  accessKeyId: Scalars['String']['input'];
  /** AWS secret access key */
  accessKeySecret: Scalars['String']['input'];
  /** HTTPS Git credentials for AWS CodeCommit. Password */
  gitPassword: Scalars['String']['input'];
  /** HTTPS Git credentials for AWS CodeCommit. Username */
  gitUsername: Scalars['String']['input'];
  /** AWS region. Defaults to us-east-1 */
  region?: InputMaybe<Scalars['String']['input']>;
};

export type GitOrganizationCreateInputGitHub = {
  installationId: Scalars['String']['input'];
};

export type GitOrganizationOrderByInput = {
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  provider?: InputMaybe<SortOrder>;
};

export type GitOrganizationWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type GitRepository = {
  baseBranchName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  gitOrganization: GitOrganization;
  gitOrganizationId: Scalars['String']['output'];
  groupName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GitRepositoryOrderByInput = {
  baseBranchName?: InputMaybe<SortOrder>;
  gitOrganization?: InputMaybe<GitOrganizationOrderByInput>;
  gitOrganizationId?: InputMaybe<SortOrder>;
  groupName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type GitRepositoryUpdateInput = {
  baseBranchName?: InputMaybe<Scalars['String']['input']>;
};

export type IBlock = {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Invitation = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invitedByUser?: Maybe<User>;
  updatedAt: Scalars['DateTime']['output'];
  workspace?: Maybe<Workspace>;
};

export type InviteUserInput = {
  email: Scalars['String']['input'];
};

export type JsonPathStringFilter = {
  matchAll: Array<JsonPathStringFilterItem>;
};

export type JsonPathStringFilterItem = {
  arrayContains?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  path: Scalars['String']['input'];
  stringContains?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessagePattern = {
  topicId: Scalars['String']['output'];
  type: EnumMessagePatternConnectionOptions;
};

export type MessagePatternCreateInput = {
  topicId: Scalars['String']['input'];
  type: EnumMessagePatternConnectionOptions;
};

export type MetaQueryPayload = {
  count: Scalars['Float']['output'];
};

export type Metrics = {
  count: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  timeGroup: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type Module = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ModuleAction = IBlock & {
  actionType: EnumModuleActionType;
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  fieldPermanentId?: Maybe<Scalars['String']['output']>;
  gqlOperation: EnumModuleActionGqlOperation;
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  inputType?: Maybe<PropertyTypeDef>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  outputType?: Maybe<PropertyTypeDef>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  restInputBodyPropertyName?: Maybe<Scalars['String']['output']>;
  restInputParamsPropertyName?: Maybe<Scalars['String']['output']>;
  restInputQueryPropertyName?: Maybe<Scalars['String']['output']>;
  restInputSource?: Maybe<EnumModuleActionRestInputSource>;
  restVerb: EnumModuleActionRestVerb;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ModuleActionCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
};

export type ModuleActionOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ModuleActionUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  gqlOperation?: InputMaybe<EnumModuleActionGqlOperation>;
  inputType?: InputMaybe<PropertyTypeDefInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  outputType?: InputMaybe<PropertyTypeDefInput>;
  path?: InputMaybe<Scalars['String']['input']>;
  restInputBodyPropertyName?: InputMaybe<Scalars['String']['input']>;
  restInputParamsPropertyName?: InputMaybe<Scalars['String']['input']>;
  restInputQueryPropertyName?: InputMaybe<Scalars['String']['input']>;
  restInputSource?: InputMaybe<EnumModuleActionRestInputSource>;
  restVerb?: InputMaybe<EnumModuleActionRestVerb>;
};

export type ModuleActionWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  includeCustomActions?: InputMaybe<Scalars['Boolean']['input']>;
  includeDefaultActions?: InputMaybe<Scalars['Boolean']['input']>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ModuleCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
};

export type ModuleDto = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  dtoType: EnumModuleDtoType;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<ModuleDtoEnumMember>>;
  name: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Array<ModuleDtoProperty>>;
  relatedEntityId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ModuleDtoCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
};

export type ModuleDtoEnumMember = {
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ModuleDtoEnumMemberCreateInput = {
  moduleDto: WhereParentIdInput;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ModuleDtoEnumMemberInput = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ModuleDtoEnumMemberUpdateInput = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ModuleDtoOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ModuleDtoProperty = {
  isArray: Scalars['Boolean']['output'];
  isOptional: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  propertyTypes: Array<PropertyTypeDef>;
};

export type ModuleDtoPropertyCreateInput = {
  moduleDto: WhereParentIdInput;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ModuleDtoPropertyInput = {
  isArray: Scalars['Boolean']['input'];
  isOptional: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  propertyTypes: Array<PropertyTypeDefInput>;
};

export type ModuleDtoPropertyUpdateInput = {
  isArray: Scalars['Boolean']['input'];
  isOptional: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  propertyTypes: Array<PropertyTypeDefInput>;
};

export type ModuleDtoUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled: Scalars['Boolean']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ModuleDtoWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  includeCustomDtos?: InputMaybe<Scalars['Boolean']['input']>;
  includeDefaultDtos?: InputMaybe<Scalars['Boolean']['input']>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ModuleOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ModuleUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ModuleWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Mutation = {
  addEntityPermissionField: EntityPermissionField;
  addMembersToTeam: Team;
  bulkUpdateWorkspaceProjectsAndResourcesLicensed: Scalars['Boolean']['output'];
  changePassword: Account;
  commit?: Maybe<Commit>;
  completeGitOAuth2Flow: GitOrganization;
  completeInvitation: Auth;
  completeSignupWithBusinessEmail: Scalars['String']['output'];
  connectGitRepository: Resource;
  connectResourceGitRepository: Resource;
  connectResourceToProjectRepository: Resource;
  createApiToken: ApiToken;
  createBlueprint: Blueprint;
  createComponent: Resource;
  createCustomProperty: CustomProperty;
  createCustomPropertyOption: CustomPropertyOption;
  createDefaultEntities?: Maybe<Array<Entity>>;
  createEntitiesFromPredefinedSchema: UserAction;
  createEntitiesFromPrismaSchema: UserAction;
  createEntityField: EntityField;
  createEntityFieldByDisplayName: EntityField;
  createMessageBroker: Resource;
  createModule: Module;
  createModuleAction: ModuleAction;
  createModuleDto: ModuleDto;
  createModuleDtoEnum: ModuleDto;
  createModuleDtoEnumMember: ModuleDtoEnumMember;
  createModuleDtoProperty: ModuleDtoProperty;
  createOneEntity: Entity;
  createOrganization: GitOrganization;
  createPackage: Package;
  createPluginInstallation: PluginInstallation;
  createPluginRepository: Resource;
  createPrivatePlugin: PrivatePlugin;
  createPrivatePluginVersion: PrivatePluginVersion;
  createProject: Project;
  createRelation: Relation;
  createRemoteGitRepository: RemoteGitRepository;
  createResourceRole: ResourceRole;
  createService: Resource;
  createServiceFromTemplate: Resource;
  createServiceTemplate: Resource;
  createServiceTopics: ServiceTopics;
  createServiceWithEntities: ResourceCreateWithEntitiesResult;
  createTeam: Team;
  createTopic: Topic;
  createWorkspace?: Maybe<Workspace>;
  deleteApiToken: ApiToken;
  deleteBlueprint?: Maybe<Blueprint>;
  deleteBlueprintRelation: BlueprintRelation;
  deleteCustomProperty?: Maybe<CustomProperty>;
  deleteCustomPropertyOption: CustomPropertyOption;
  deleteEntity?: Maybe<Entity>;
  deleteEntityField: EntityField;
  deleteEntityPermissionField: EntityPermissionField;
  deleteGitOrganization: Scalars['Boolean']['output'];
  deleteGitRepository: Resource;
  deleteModule: Module;
  deleteModuleAction: ModuleAction;
  deleteModuleDto: ModuleDto;
  deleteModuleDtoEnumMember: ModuleDtoEnumMember;
  deleteModuleDtoProperty: ModuleDtoProperty;
  deletePackage: Package;
  deletePluginInstallation: PluginInstallation;
  deletePrivatePlugin: PrivatePlugin;
  deleteProject?: Maybe<Project>;
  deleteRelation: Relation;
  deleteResource?: Maybe<Resource>;
  deleteResourceRole?: Maybe<ResourceRole>;
  deleteServiceTopics: ServiceTopics;
  deleteTeam?: Maybe<Team>;
  deleteTopic: Topic;
  deleteUser?: Maybe<User>;
  deleteWorkspace?: Maybe<Workspace>;
  discardPendingChanges?: Maybe<Scalars['Boolean']['output']>;
  disconnectResourceGitRepository: Resource;
  getGitResourceInstallationUrl: AuthorizeResourceWithGitResult;
  inviteUser?: Maybe<Invitation>;
  lockEntity?: Maybe<Entity>;
  login: Auth;
  provisionSubscription?: Maybe<ProvisionSubscriptionResult>;
  redeemCoupon: Coupon;
  redesignProject: UserAction;
  removeMembersFromTeam: Team;
  resendInvitation?: Maybe<Invitation>;
  revokeInvitation?: Maybe<Invitation>;
  scaffoldServiceFromTemplate: Resource;
  sendAssistantMessageWithStream: AssistantThread;
  setCurrentWorkspace: Auth;
  setPluginOrder?: Maybe<PluginOrder>;
  setResourceOwner: Ownership;
  signup: Auth;
  signupPreviewAccount: AuthPreviewAccount;
  signupWithBusinessEmail: Scalars['Boolean']['output'];
  startRedesign?: Maybe<Resource>;
  /** Trigger the generation of a set of recommendations for breaking a resource into microservices */
  triggerBreakServiceIntoMicroservices?: Maybe<UserAction>;
  updateAccount: Account;
  updateBlueprint: Blueprint;
  updateCodeGeneratorVersion?: Maybe<Resource>;
  updateCustomProperty: CustomProperty;
  updateCustomPropertyOption: CustomPropertyOption;
  updateEntity?: Maybe<Entity>;
  updateEntityField: EntityField;
  updateEntityPermission: EntityPermission;
  updateEntityPermissionFieldRoles: EntityPermissionField;
  updateEntityPermissionRoles: EntityPermission;
  updateGitRepository: GitRepository;
  updateModule: Module;
  updateModuleAction: ModuleAction;
  updateModuleDto: ModuleDto;
  updateModuleDtoEnumMember: ModuleDtoEnumMember;
  updateModuleDtoProperty: ModuleDtoProperty;
  updateOutdatedVersionAlert: OutdatedVersionAlert;
  updatePackage: Package;
  updatePluginInstallation: PluginInstallation;
  updatePrivatePlugin: PrivatePlugin;
  updatePrivatePluginVersion: PrivatePluginVersion;
  updateProject: Project;
  updateProjectConfigurationSettings?: Maybe<ProjectConfigurationSettings>;
  updateRelation: Relation;
  updateResource?: Maybe<Resource>;
  updateResourceRelation: Relation;
  updateResourceRole?: Maybe<ResourceRole>;
  updateResourceSettings?: Maybe<ResourceSettings>;
  updateServiceSettings?: Maybe<ServiceSettings>;
  updateServiceTopics: ServiceTopics;
  updateTeam: Team;
  updateTopic: Topic;
  updateWorkspace?: Maybe<Workspace>;
  upgradeServiceToLatestTemplateVersion: Resource;
  upsertBlueprintRelation: BlueprintRelation;
};


export type MutationAddEntityPermissionFieldArgs = {
  data: EntityAddPermissionFieldInput;
};


export type MutationAddMembersToTeamArgs = {
  data: TeamUpdateMembersInput;
  where: WhereUniqueInput;
};


export type MutationBulkUpdateWorkspaceProjectsAndResourcesLicensedArgs = {
  useUserLastActive?: InputMaybe<Scalars['Boolean']['input']>;
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
  resourceId: Scalars['String']['input'];
};


export type MutationCreateApiTokenArgs = {
  data: ApiTokenCreateInput;
};


export type MutationCreateBlueprintArgs = {
  data: BlueprintCreateInput;
};


export type MutationCreateComponentArgs = {
  data: ResourceCreateInput;
};


export type MutationCreateCustomPropertyArgs = {
  data: CustomPropertyCreateInput;
};


export type MutationCreateCustomPropertyOptionArgs = {
  data: CustomPropertyOptionCreateInput;
};


export type MutationCreateDefaultEntitiesArgs = {
  data: DefaultEntitiesInput;
};


export type MutationCreateEntitiesFromPredefinedSchemaArgs = {
  data: CreateEntitiesFromPredefinedSchemaInput;
};


export type MutationCreateEntitiesFromPrismaSchemaArgs = {
  data: DbSchemaImportCreateInput;
  file: Scalars['Upload']['input'];
};


export type MutationCreateEntityFieldArgs = {
  data: EntityFieldCreateInput;
  relatedFieldAllowMultipleSelection?: InputMaybe<Scalars['Boolean']['input']>;
  relatedFieldDisplayName?: InputMaybe<Scalars['String']['input']>;
  relatedFieldName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateEntityFieldByDisplayNameArgs = {
  data: EntityFieldCreateByDisplayNameInput;
};


export type MutationCreateMessageBrokerArgs = {
  data: ResourceCreateInput;
};


export type MutationCreateModuleArgs = {
  data: ModuleCreateInput;
};


export type MutationCreateModuleActionArgs = {
  data: ModuleActionCreateInput;
};


export type MutationCreateModuleDtoArgs = {
  data: ModuleDtoCreateInput;
  members?: InputMaybe<Array<ModuleDtoEnumMemberInput>>;
  properties?: InputMaybe<Array<ModuleDtoPropertyInput>>;
};


export type MutationCreateModuleDtoEnumArgs = {
  data: ModuleDtoCreateInput;
  members?: InputMaybe<Array<ModuleDtoEnumMemberInput>>;
  properties?: InputMaybe<Array<ModuleDtoPropertyInput>>;
};


export type MutationCreateModuleDtoEnumMemberArgs = {
  data: ModuleDtoEnumMemberCreateInput;
};


export type MutationCreateModuleDtoPropertyArgs = {
  data: ModuleDtoPropertyCreateInput;
};


export type MutationCreateOneEntityArgs = {
  data: EntityCreateInput;
};


export type MutationCreateOrganizationArgs = {
  data: GitOrganizationCreateInput;
};


export type MutationCreatePackageArgs = {
  data: PackageCreateInput;
};


export type MutationCreatePluginInstallationArgs = {
  data: PluginInstallationCreateInput;
};


export type MutationCreatePluginRepositoryArgs = {
  data: ResourceCreateInput;
};


export type MutationCreatePrivatePluginArgs = {
  data: PrivatePluginCreateInput;
};


export type MutationCreatePrivatePluginVersionArgs = {
  data: PrivatePluginVersionCreateInput;
};


export type MutationCreateProjectArgs = {
  data: ProjectCreateInput;
};


export type MutationCreateRelationArgs = {
  data: RelationCreateInput;
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


export type MutationCreateServiceFromTemplateArgs = {
  data: ServiceFromTemplateCreateInput;
};


export type MutationCreateServiceTemplateArgs = {
  data: ServiceTemplateCreateInput;
};


export type MutationCreateServiceTopicsArgs = {
  data: ServiceTopicsCreateInput;
};


export type MutationCreateServiceWithEntitiesArgs = {
  data: ResourceCreateWithEntitiesInput;
};


export type MutationCreateTeamArgs = {
  data: TeamCreateInput;
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


export type MutationDeleteBlueprintArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteBlueprintRelationArgs = {
  where: WhereBlueprintRelationUniqueInput;
};


export type MutationDeleteCustomPropertyArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteCustomPropertyOptionArgs = {
  where: WhereCustomPropertyOptionUniqueInput;
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
  gitOrganizationId: Scalars['String']['input'];
  gitProvider: EnumGitProvider;
};


export type MutationDeleteGitRepositoryArgs = {
  gitRepositoryId: Scalars['String']['input'];
};


export type MutationDeleteModuleArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteModuleActionArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteModuleDtoArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteModuleDtoEnumMemberArgs = {
  where: WhereEnumMemberUniqueInput;
};


export type MutationDeleteModuleDtoPropertyArgs = {
  where: WherePropertyUniqueInput;
};


export type MutationDeletePackageArgs = {
  where: WhereUniqueInput;
};


export type MutationDeletePluginInstallationArgs = {
  where: WhereUniqueInput;
};


export type MutationDeletePrivatePluginArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteProjectArgs = {
  where: WhereUniqueInput;
};


export type MutationDeleteRelationArgs = {
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


export type MutationDeleteTeamArgs = {
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
  resourceId: Scalars['String']['input'];
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


export type MutationRedeemCouponArgs = {
  data: RedeemCouponInput;
};


export type MutationRedesignProjectArgs = {
  data: RedesignProjectInput;
};


export type MutationRemoveMembersFromTeamArgs = {
  data: TeamUpdateMembersInput;
  where: WhereUniqueInput;
};


export type MutationResendInvitationArgs = {
  where: WhereUniqueInput;
};


export type MutationRevokeInvitationArgs = {
  where: WhereUniqueInput;
};


export type MutationScaffoldServiceFromTemplateArgs = {
  data: ScaffoldServiceFromTemplateInput;
};


export type MutationSendAssistantMessageWithStreamArgs = {
  context: AssistantContext;
  data: SendAssistantMessageInput;
};


export type MutationSetCurrentWorkspaceArgs = {
  data: WhereUniqueInput;
};


export type MutationSetPluginOrderArgs = {
  data: PluginSetOrderInput;
  where: WhereUniqueInput;
};


export type MutationSetResourceOwnerArgs = {
  data: ResourceSetOwnerInput;
};


export type MutationSignupArgs = {
  data: SignupInput;
};


export type MutationSignupPreviewAccountArgs = {
  data: SignupPreviewAccountInput;
};


export type MutationSignupWithBusinessEmailArgs = {
  data: SignupWithBusinessEmailInput;
};


export type MutationStartRedesignArgs = {
  data: WhereUniqueInput;
};


export type MutationTriggerBreakServiceIntoMicroservicesArgs = {
  resourceId: Scalars['String']['input'];
};


export type MutationUpdateAccountArgs = {
  data: UpdateAccountInput;
};


export type MutationUpdateBlueprintArgs = {
  data: BlueprintUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateCodeGeneratorVersionArgs = {
  data: CodeGeneratorVersionUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateCustomPropertyArgs = {
  data: CustomPropertyUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateCustomPropertyOptionArgs = {
  data: CustomPropertyOptionUpdateInput;
  where: WhereCustomPropertyOptionUniqueInput;
};


export type MutationUpdateEntityArgs = {
  data: EntityUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateEntityFieldArgs = {
  data: EntityFieldUpdateInput;
  relatedFieldAllowMultipleSelection?: InputMaybe<Scalars['Boolean']['input']>;
  relatedFieldDisplayName?: InputMaybe<Scalars['String']['input']>;
  relatedFieldName?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateGitRepositoryArgs = {
  data: GitRepositoryUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateModuleArgs = {
  data: ModuleUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateModuleActionArgs = {
  data: ModuleActionUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateModuleDtoArgs = {
  data: ModuleDtoUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateModuleDtoEnumMemberArgs = {
  data: ModuleDtoEnumMemberUpdateInput;
  where: WhereEnumMemberUniqueInput;
};


export type MutationUpdateModuleDtoPropertyArgs = {
  data: ModuleDtoPropertyUpdateInput;
  where: WherePropertyUniqueInput;
};


export type MutationUpdateOutdatedVersionAlertArgs = {
  data: OutdatedVersionAlertUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdatePackageArgs = {
  data: PackageUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdatePluginInstallationArgs = {
  data: PluginInstallationUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdatePrivatePluginArgs = {
  data: PrivatePluginUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdatePrivatePluginVersionArgs = {
  data: PrivatePluginVersionUpdateInput;
  where: WherePrivatePluginVersionUniqueInput;
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateProjectConfigurationSettingsArgs = {
  data: ProjectConfigurationSettingsUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateRelationArgs = {
  data: RelationUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateResourceArgs = {
  data: ResourceUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateResourceRelationArgs = {
  data: ResourceRelationUpdateInput;
  resource: WhereUniqueInput;
};


export type MutationUpdateResourceRoleArgs = {
  data: ResourceRoleUpdateInput;
  where: WhereUniqueInput;
};


export type MutationUpdateResourceSettingsArgs = {
  data: ResourceSettingsUpdateInput;
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


export type MutationUpdateTeamArgs = {
  data: TeamUpdateInput;
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


export type MutationUpgradeServiceToLatestTemplateVersionArgs = {
  where: WhereUniqueInput;
};


export type MutationUpsertBlueprintRelationArgs = {
  data: BlueprintRelationUpsertInput;
  where: WhereBlueprintRelationUniqueInput;
};

export type OutdatedVersionAlert = {
  block?: Maybe<Block>;
  blockId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  latestVersion: Scalars['String']['output'];
  outdatedVersion: Scalars['String']['output'];
  resource?: Maybe<Resource>;
  resourceId: Scalars['String']['output'];
  status: EnumOutdatedVersionAlertStatus;
  type: EnumOutdatedVersionAlertType;
  updatedAt: Scalars['DateTime']['output'];
};

export type OutdatedVersionAlertOrderByInput = {
  block?: InputMaybe<BlockOrderByInput>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  latestVersion?: InputMaybe<SortOrder>;
  outdatedVersion?: InputMaybe<SortOrder>;
  resource?: InputMaybe<ResourceOrderByInput>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type OutdatedVersionAlertUpdateInput = {
  status?: InputMaybe<Scalars['String']['input']>;
};

export type OutdatedVersionAlertWhereInput = {
  block?: InputMaybe<WhereUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  latestVersion?: InputMaybe<StringFilter>;
  outdatedVersion?: InputMaybe<StringFilter>;
  resource: ResourceWhereInput;
  status?: InputMaybe<EnumOutdatedVersionAlertStatusFilter>;
  type?: InputMaybe<EnumOutdatedVersionAlertTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Owner = Team | User;

export type Ownership = {
  owner: Owner;
};

export type OwnershipWhereInput = {
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Package = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type PackageCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  resource: WhereParentIdInput;
  summary: Scalars['String']['input'];
};

export type PackageOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type PackageUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  packageStatus?: InputMaybe<EnumPackageStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type PackageWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

/** Returns a paginated list of repository groups available to select. */
export type PaginatedGitGroup = {
  groups?: Maybe<Array<GitGroup>>;
  /** Page number */
  page: Scalars['Float']['output'];
  /** Number of groups per page */
  pageSize: Scalars['Float']['output'];
  /** Total number of groups */
  total: Scalars['Float']['output'];
};

export type PaginatedResourceQueryResult = {
  data?: Maybe<Array<Resource>>;
  totalCount: Scalars['Int']['output'];
};

export type Pagination = {
  page: Scalars['Float']['output'];
  perPage: Scalars['Float']['output'];
};

export type PendingChange = {
  action: EnumPendingChangeAction;
  origin: PendingChangeOrigin;
  originId: Scalars['String']['output'];
  originType: EnumPendingChangeOriginType;
  resource: Resource;
  versionNumber: Scalars['Int']['output'];
};

export type PendingChangeOrigin = Block | Entity;

export type PendingChangesDiscardInput = {
  project: WhereParentIdInput;
  resourceTypeGroup: EnumResourceTypeGroup;
};

export type PendingChangesFindInput = {
  project: WhereUniqueInput;
  resourceTypeGroup: EnumResourceTypeGroup;
};

export type PluginInstallation = IBlock & {
  blockType: EnumBlockType;
  configurations?: Maybe<Scalars['JSONObject']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  isPrivate?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  npm: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  pluginId: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['String']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type PluginInstallationCreateInput = {
  configurations?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  isPrivate: Scalars['Boolean']['input'];
  npm: Scalars['String']['input'];
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  pluginId: Scalars['String']['input'];
  resource: WhereParentIdInput;
  settings?: InputMaybe<Scalars['JSONObject']['input']>;
  version: Scalars['String']['input'];
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
  configurations?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled: Scalars['Boolean']['input'];
  settings?: InputMaybe<Scalars['JSONObject']['input']>;
  version: Scalars['String']['input'];
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
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  order: Array<PluginOrderItem>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type PluginOrderItem = {
  order: Scalars['Int']['output'];
  pluginId: Scalars['String']['output'];
};

export type PluginSetOrderInput = {
  order: Scalars['Int']['input'];
};

export type PrivatePlugin = IBlock & {
  blockType: EnumBlockType;
  blueprints?: Maybe<Array<Scalars['String']['output']>>;
  codeGenerator: EnumCodeGenerator;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  pluginId: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
  versions: Array<PrivatePluginVersion>;
};

export type PrivatePluginCreateInput = {
  codeGenerator: EnumCodeGenerator;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  pluginId: Scalars['String']['input'];
  resource: WhereParentIdInput;
};

export type PrivatePluginOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type PrivatePluginUpdateInput = {
  blueprints?: InputMaybe<Array<Scalars['String']['input']>>;
  codeGenerator?: InputMaybe<EnumCodeGenerator>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled: Scalars['Boolean']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
};

export type PrivatePluginVersion = {
  configurations?: Maybe<Scalars['JSONObject']['output']>;
  deprecated: Scalars['Boolean']['output'];
  enabled: Scalars['Boolean']['output'];
  settings?: Maybe<Scalars['JSONObject']['output']>;
  version: Scalars['String']['output'];
};

export type PrivatePluginVersionCreateInput = {
  privatePlugin: WhereParentIdInput;
  version: Scalars['String']['input'];
};

export type PrivatePluginVersionUpdateInput = {
  configurations?: InputMaybe<Scalars['JSONObject']['input']>;
  deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  settings?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type PrivatePluginWhereInput = {
  blue?: InputMaybe<EnumCodeGeneratorFilter>;
  codeGenerator?: InputMaybe<EnumCodeGeneratorFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Project = {
  createdAt: Scalars['DateTime']['output'];
  demoRepoName?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  licensed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  platformIsPublic?: Maybe<Scalars['Boolean']['output']>;
  resources?: Maybe<Array<Resource>>;
  updatedAt: Scalars['DateTime']['output'];
  useDemoRepo: Scalars['Boolean']['output'];
};

export type ProjectConfigurationSettings = IBlock & {
  baseDirectory: Scalars['String']['output'];
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  overrideCustomizableFilesInGit?: Maybe<Scalars['Boolean']['output']>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ProjectConfigurationSettingsUpdateInput = {
  baseDirectory?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  overrideCustomizableFilesInGit?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectCreateInput = {
  name: Scalars['String']['input'];
};

export type ProjectOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type ProjectUpdateInput = {
  platformIsPublic?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectWhereInput = {
  deletedAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
  platformIsPublic?: InputMaybe<BooleanFilter>;
};

export type PropertySelector = {
  include: Scalars['Boolean']['output'];
  propertyName: Scalars['String']['output'];
};

export type PropertySelectorInput = {
  include: Scalars['Boolean']['input'];
  propertyName: Scalars['String']['input'];
};

export type PropertyTypeDef = {
  dtoId?: Maybe<Scalars['String']['output']>;
  isArray: Scalars['Boolean']['output'];
  type: EnumModuleDtoPropertyType;
};

export type PropertyTypeDefInput = {
  dtoId?: InputMaybe<Scalars['String']['input']>;
  isArray: Scalars['Boolean']['input'];
  type: EnumModuleDtoPropertyType;
};

export type ProvisionSubscriptionInput = {
  billingPeriod: Scalars['String']['input'];
  cancelUrl?: InputMaybe<Scalars['String']['input']>;
  intentionType: Scalars['String']['input'];
  planId: Scalars['String']['input'];
  successUrl?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['String']['input'];
};

export type ProvisionSubscriptionResult = {
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  provisionStatus: Scalars['String']['output'];
};

export type Query = {
  _outdatedVersionAlertsMeta: MetaQueryPayload;
  _resourceVersionsMeta: MetaQueryPayload;
  account: Account;
  action: Action;
  availableDtosForResource: Array<ModuleDto>;
  availablePrivatePluginsForResource: Array<PrivatePlugin>;
  availableTemplatesForProject: Array<Resource>;
  block: Block;
  blocks: Array<Block>;
  blueprint?: Maybe<Blueprint>;
  blueprints: Array<Blueprint>;
  build: Build;
  builds: Array<Build>;
  catalog: PaginatedResourceQueryResult;
  commit?: Maybe<Commit>;
  commits?: Maybe<Array<Commit>>;
  compareResourceVersions: ResourceVersionsDiff;
  contactUsLink?: Maybe<Scalars['String']['output']>;
  currentWorkspace?: Maybe<Workspace>;
  customProperties: Array<CustomProperty>;
  customProperty?: Maybe<CustomProperty>;
  entities: Array<Entity>;
  entity?: Maybe<Entity>;
  /** Get the changes to apply to the model in order to break a resource into microservices */
  finalizeBreakServiceIntoMicroservices: BreakServiceToMicroservicesResult;
  getEvaluationInsights: EvaluationInsights;
  getUsageInsights: UsageInsightsResult;
  gitGroups: PaginatedGitGroup;
  gitOrganization: GitOrganization;
  gitOrganizations: Array<GitOrganization>;
  me: User;
  messageBrokerConnectedServices: Array<Resource>;
  module?: Maybe<Module>;
  moduleAction?: Maybe<ModuleAction>;
  moduleActions: Array<ModuleAction>;
  moduleDto?: Maybe<ModuleDto>;
  moduleDtos: Array<ModuleDto>;
  modules: Array<Module>;
  outdatedVersionAlert: OutdatedVersionAlert;
  outdatedVersionAlerts: Array<OutdatedVersionAlert>;
  package?: Maybe<Package>;
  packageList: Array<Package>;
  pendingChanges: Array<PendingChange>;
  pluginInstallation?: Maybe<PluginInstallation>;
  pluginInstallations: Array<PluginInstallation>;
  pluginOrder: PluginOrder;
  pluginRepositoryRemotePlugins: GitFolderContent;
  privatePlugin?: Maybe<PrivatePlugin>;
  privatePlugins: Array<PrivatePlugin>;
  project?: Maybe<Project>;
  projectConfigurationSettings: ProjectConfigurationSettings;
  projects: Array<Project>;
  relation?: Maybe<Relation>;
  relations: Array<Relation>;
  remoteGitRepositories: RemoteGitRepos;
  resource?: Maybe<Resource>;
  resourceRole?: Maybe<ResourceRole>;
  resourceRoles: Array<ResourceRole>;
  resourceSettings: ResourceSettings;
  resourceVersion: ResourceVersion;
  resourceVersions: Array<ResourceVersion>;
  resources: Array<Resource>;
  serviceSettings: ServiceSettings;
  serviceTemplates: Array<Resource>;
  serviceTopics?: Maybe<ServiceTopics>;
  serviceTopicsList: Array<ServiceTopics>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  topic?: Maybe<Topic>;
  topics: Array<Topic>;
  userAction: UserAction;
  userApiTokens: Array<ApiToken>;
  workspace?: Maybe<Workspace>;
  workspaceMembers?: Maybe<Array<WorkspaceMember>>;
  workspaceUsers?: Maybe<Array<User>>;
  workspaces: Array<Workspace>;
};


export type Query_OutdatedVersionAlertsMetaArgs = {
  orderBy?: InputMaybe<OutdatedVersionAlertOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OutdatedVersionAlertWhereInput>;
};


export type Query_ResourceVersionsMetaArgs = {
  orderBy?: InputMaybe<ResourceVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceVersionWhereInput>;
};


export type QueryActionArgs = {
  where: WhereUniqueInput;
};


export type QueryAvailableDtosForResourceArgs = {
  orderBy?: InputMaybe<ModuleDtoOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ModuleDtoWhereInput>;
};


export type QueryAvailablePrivatePluginsForResourceArgs = {
  orderBy?: InputMaybe<PrivatePluginOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PrivatePluginWhereInput>;
};


export type QueryAvailableTemplatesForProjectArgs = {
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where: WhereUniqueInput;
};


export type QueryBlockArgs = {
  where: WhereUniqueInput;
};


export type QueryBlocksArgs = {
  orderBy?: InputMaybe<BlockOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryBlueprintArgs = {
  where: WhereUniqueInput;
};


export type QueryBlueprintsArgs = {
  orderBy?: InputMaybe<BlueprintOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BlueprintWhereInput>;
};


export type QueryBuildArgs = {
  where: WhereUniqueInput;
};


export type QueryBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BuildWhereInput>;
};


export type QueryCatalogArgs = {
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceWhereInputWithPropertiesFilter>;
};


export type QueryCommitArgs = {
  where: CommitWhereUniqueInput;
};


export type QueryCommitsArgs = {
  cursor?: InputMaybe<CommitWhereUniqueInput>;
  orderBy?: InputMaybe<CommitOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where: CommitWhereInput;
};


export type QueryCompareResourceVersionsArgs = {
  where: CompareResourceVersionsWhereInput;
};


export type QueryContactUsLinkArgs = {
  where: WhereUniqueInput;
};


export type QueryCustomPropertiesArgs = {
  orderBy?: InputMaybe<CustomPropertyOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CustomPropertyWhereInput>;
};


export type QueryCustomPropertyArgs = {
  where: WhereUniqueInput;
};


export type QueryEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EntityWhereInput>;
};


export type QueryEntityArgs = {
  where: WhereUniqueInput;
};


export type QueryFinalizeBreakServiceIntoMicroservicesArgs = {
  userActionId: Scalars['String']['input'];
};


export type QueryGetEvaluationInsightsArgs = {
  endDate: Scalars['DateTime']['input'];
  projectIds: Array<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  timeGroup?: InputMaybe<EnumTimeGroup>;
};


export type QueryGetUsageInsightsArgs = {
  endDate: Scalars['DateTime']['input'];
  projectIds: Array<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  timeGroup?: InputMaybe<EnumTimeGroup>;
};


export type QueryGitGroupsArgs = {
  where: GitGroupInput;
};


export type QueryGitOrganizationArgs = {
  where: WhereUniqueInput;
};


export type QueryGitOrganizationsArgs = {
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
  where?: InputMaybe<GitOrganizationWhereInput>;
};


export type QueryMessageBrokerConnectedServicesArgs = {
  where: WhereUniqueInput;
};


export type QueryModuleArgs = {
  where: WhereUniqueInput;
};


export type QueryModuleActionArgs = {
  where: WhereUniqueInput;
};


export type QueryModuleActionsArgs = {
  orderBy?: InputMaybe<ModuleActionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ModuleActionWhereInput>;
};


export type QueryModuleDtoArgs = {
  where: WhereUniqueInput;
};


export type QueryModuleDtosArgs = {
  orderBy?: InputMaybe<ModuleDtoOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ModuleDtoWhereInput>;
};


export type QueryModulesArgs = {
  orderBy?: InputMaybe<ModuleOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ModuleWhereInput>;
};


export type QueryOutdatedVersionAlertArgs = {
  where: WhereUniqueInput;
};


export type QueryOutdatedVersionAlertsArgs = {
  orderBy?: InputMaybe<OutdatedVersionAlertOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OutdatedVersionAlertWhereInput>;
};


export type QueryPackageArgs = {
  where: WhereUniqueInput;
};


export type QueryPackageListArgs = {
  orderBy?: InputMaybe<PackageOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PackageWhereInput>;
};


export type QueryPendingChangesArgs = {
  where: PendingChangesFindInput;
};


export type QueryPluginInstallationArgs = {
  where: WhereUniqueInput;
};


export type QueryPluginInstallationsArgs = {
  orderBy?: InputMaybe<PluginInstallationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PluginInstallationWhereInput>;
};


export type QueryPluginOrderArgs = {
  where: WhereUniqueInput;
};


export type QueryPluginRepositoryRemotePluginsArgs = {
  where: WhereUniqueInput;
};


export type QueryPrivatePluginArgs = {
  where: WhereUniqueInput;
};


export type QueryPrivatePluginsArgs = {
  orderBy?: InputMaybe<PrivatePluginOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PrivatePluginWhereInput>;
};


export type QueryProjectArgs = {
  where: WhereUniqueInput;
};


export type QueryProjectConfigurationSettingsArgs = {
  where: WhereUniqueInput;
};


export type QueryProjectsArgs = {
  orderBy?: InputMaybe<ProjectOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectWhereInput>;
};


export type QueryRelationArgs = {
  where: WhereUniqueInput;
};


export type QueryRelationsArgs = {
  orderBy?: InputMaybe<RelationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RelationWhereInput>;
};


export type QueryRemoteGitRepositoriesArgs = {
  where: RemoteGitRepositoriesWhereUniqueInput;
};


export type QueryResourceArgs = {
  where: WhereUniqueInput;
};


export type QueryResourceRoleArgs = {
  version?: InputMaybe<Scalars['Float']['input']>;
  where: WhereUniqueInput;
};


export type QueryResourceRolesArgs = {
  orderBy?: InputMaybe<ResourceRoleOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceRoleWhereInput>;
};


export type QueryResourceSettingsArgs = {
  where: WhereUniqueInput;
};


export type QueryResourceVersionArgs = {
  where: WhereUniqueInput;
};


export type QueryResourceVersionsArgs = {
  orderBy?: InputMaybe<ResourceVersionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceVersionWhereInput>;
};


export type QueryResourcesArgs = {
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceWhereInputWithPropertiesFilter>;
};


export type QueryServiceSettingsArgs = {
  where: WhereUniqueInput;
};


export type QueryServiceTemplatesArgs = {
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResourceWhereInputWithPropertiesFilter>;
};


export type QueryServiceTopicsArgs = {
  where: WhereUniqueInput;
};


export type QueryServiceTopicsListArgs = {
  orderBy?: InputMaybe<ServiceTopicsOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ServiceTopicsWhereInput>;
};


export type QueryTeamArgs = {
  where: WhereUniqueInput;
};


export type QueryTeamsArgs = {
  orderBy?: InputMaybe<TeamOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TeamWhereInput>;
};


export type QueryTopicArgs = {
  where: WhereUniqueInput;
};


export type QueryTopicsArgs = {
  orderBy?: InputMaybe<TopicOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TopicWhereInput>;
};


export type QueryUserActionArgs = {
  where: WhereUniqueInput;
};


export type QueryWorkspaceArgs = {
  where: WhereUniqueInput;
};

export enum QueryMode {
  Default = 'Default',
  Insensitive = 'Insensitive'
}

export type RedeemCouponInput = {
  code: Scalars['String']['input'];
};

export type RedesignProjectInput = {
  movedEntities: Array<RedesignProjectMovedEntity>;
  newServices: Array<RedesignProjectNewService>;
  projectId: Scalars['String']['input'];
};

export type RedesignProjectMovedEntity = {
  entityId: Scalars['String']['input'];
  originalResourceId: Scalars['String']['input'];
  targetResourceId: Scalars['String']['input'];
};

export type RedesignProjectNewService = {
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Relation = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  relatedResources: Array<Scalars['String']['output']>;
  relationKey: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type RelationCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  outputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  parentBlock?: InputMaybe<WhereParentIdInput>;
  relatedResources: Array<Scalars['String']['input']>;
  relationKey: Scalars['String']['input'];
  resource: WhereParentIdInput;
};

export type RelationOrderByInput = {
  blockType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type RelationUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  relatedResources: Array<Scalars['String']['input']>;
};

export type RelationWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  parentBlock?: InputMaybe<WhereUniqueInput>;
  resource?: InputMaybe<ResourceWhereInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type RemoteGitRepos = {
  pagination: Pagination;
  repos: Array<RemoteGitRepository>;
  total: Scalars['Float']['output'];
};

export type RemoteGitRepositoriesWhereUniqueInput = {
  gitOrganizationId: Scalars['String']['input'];
  gitProvider: EnumGitProvider;
  groupName?: InputMaybe<Scalars['String']['input']>;
  /** The page number. One-based indexing */
  page?: Scalars['Float']['input'];
  /** The number of items to return per page */
  perPage?: Scalars['Float']['input'];
};

export type RemoteGitRepository = {
  defaultBranch: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  groupName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  private: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type Resource = {
  blueprint?: Maybe<Blueprint>;
  blueprintId?: Maybe<Scalars['String']['output']>;
  builds: Array<Build>;
  codeGenerator?: Maybe<EnumCodeGenerator>;
  codeGeneratorStrategy?: Maybe<CodeGeneratorVersionStrategy>;
  codeGeneratorVersion?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  entities: Array<Entity>;
  environments: Array<Environment>;
  gitRepository?: Maybe<GitRepository>;
  gitRepositoryId?: Maybe<Scalars['String']['output']>;
  gitRepositoryOverride: Scalars['Boolean']['output'];
  githubLastMessage?: Maybe<Scalars['String']['output']>;
  githubLastSync?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  licensed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Owner>;
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSONObject']['output']>;
  relations?: Maybe<Array<Relation>>;
  resourceType: EnumResourceType;
  serviceTemplate?: Maybe<Resource>;
  serviceTemplateVersion?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<ResourceSettings>;
  updatedAt: Scalars['DateTime']['output'];
  version?: Maybe<ResourceVersion>;
};


export type ResourceBuildsArgs = {
  orderBy?: InputMaybe<BuildOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BuildWhereInput>;
};


export type ResourceEntitiesArgs = {
  orderBy?: InputMaybe<EntityOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EntityWhereInput>;
};

export type ResourceCreateInput = {
  blueprint?: InputMaybe<WhereParentIdInput>;
  codeGenerator?: InputMaybe<EnumCodeGenerator>;
  description: Scalars['String']['input'];
  gitRepository?: InputMaybe<ConnectGitRepositoryInput>;
  name: Scalars['String']['input'];
  project: WhereParentIdInput;
  resourceType: EnumResourceType;
  serviceSettings?: InputMaybe<ServiceSettingsUpdateInput>;
};

export type ResourceCreateWithEntitiesEntityInput = {
  fields: Array<ResourceCreateWithEntitiesFieldInput>;
  name: Scalars['String']['input'];
  relationsToEntityIndex?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type ResourceCreateWithEntitiesFieldInput = {
  dataType?: InputMaybe<EnumDataType>;
  name: Scalars['String']['input'];
};

export type ResourceCreateWithEntitiesInput = {
  authType: Scalars['String']['input'];
  commitMessage: Scalars['String']['input'];
  connectToDemoRepo: Scalars['Boolean']['input'];
  dbType: Scalars['String']['input'];
  entities: Array<ResourceCreateWithEntitiesEntityInput>;
  plugins?: InputMaybe<PluginInstallationsCreateInput>;
  repoType: Scalars['String']['input'];
  resource: ResourceCreateInput;
  wizardType: Scalars['String']['input'];
};

export type ResourceCreateWithEntitiesResult = {
  build?: Maybe<Build>;
  resource: Resource;
};

export type ResourceOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  gitRepository?: InputMaybe<GitRepositoryOrderByInput>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  project?: InputMaybe<ProjectOrderByInput>;
  resourceType?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ResourceRelationUpdateInput = {
  relatedResources: Array<Scalars['String']['input']>;
  relationKey: Scalars['String']['input'];
};

export type ResourceRole = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ResourceRoleCreateInput = {
  description: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  name: Scalars['String']['input'];
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
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ResourceRoleWhereInput = {
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  displayName?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
  resource?: InputMaybe<WhereUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ResourceSetOwnerInput = {
  resourceId: Scalars['String']['input'];
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type ResourceSettings = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSONObject']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ResourceSettingsUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type ResourceUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  gitRepositoryOverride?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type ResourceVersion = {
  commit?: Maybe<Commit>;
  commitId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<User>;
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Resource>;
  resourceId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type ResourceVersionOrderByInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type ResourceVersionWhereInput = {
  commit?: InputMaybe<WhereUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<WhereUniqueInput>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  resource: WhereUniqueInput;
  version?: InputMaybe<StringFilter>;
};

export type ResourceVersionsDiff = {
  createdBlocks?: Maybe<Array<BlockVersion>>;
  deletedBlocks?: Maybe<Array<BlockVersion>>;
  updatedBlocks?: Maybe<Array<ResourceVersionsDiffBlock>>;
};

export type ResourceVersionsDiffBlock = {
  sourceBlockVersion: BlockVersion;
  targetBlockVersion: BlockVersion;
};

export type ResourceWhereInput = {
  blueprint?: InputMaybe<BlueprintWhereInput>;
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
  ownership?: InputMaybe<OwnershipWhereInput>;
  project?: InputMaybe<ProjectWhereInput>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<EnumResourceTypeFilter>;
  serviceTemplateId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ResourceWhereInputWithPropertiesFilter = {
  blueprint?: InputMaybe<BlueprintWhereInput>;
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
  ownership?: InputMaybe<OwnershipWhereInput>;
  project?: InputMaybe<ProjectWhereInput>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPathStringFilter>;
  resourceType?: InputMaybe<EnumResourceTypeFilter>;
  serviceTemplateId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum Role {
  Admin = 'Admin',
  OrganizationAdmin = 'OrganizationAdmin',
  ProjectAdmin = 'ProjectAdmin',
  User = 'User'
}

export type ScaffoldServiceFromTemplateInput = {
  name: Scalars['String']['input'];
  project: WhereParentIdInput;
  serviceTemplateName: Scalars['String']['input'];
};

export type SendAssistantMessageInput = {
  message: Scalars['String']['input'];
  messageType?: InputMaybe<EnumAssistantMessageType>;
  threadId?: InputMaybe<Scalars['String']['input']>;
};

export type ServerSettings = {
  generateGraphQL: Scalars['Boolean']['output'];
  generateRestApi: Scalars['Boolean']['output'];
  generateServer?: Maybe<Scalars['Boolean']['output']>;
  serverPath: Scalars['String']['output'];
};

export type ServerSettingsUpdateInput = {
  generateGraphQL?: InputMaybe<Scalars['Boolean']['input']>;
  generateRestApi?: InputMaybe<Scalars['Boolean']['input']>;
  generateServer?: InputMaybe<Scalars['Boolean']['input']>;
  serverPath?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceFromTemplateCreateInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  project: WhereParentIdInput;
  serviceTemplate: WhereUniqueInput;
};

export type ServiceSettings = IBlock & {
  adminUISettings: AdminUiSettings;
  authEntityName?: Maybe<Scalars['String']['output']>;
  authProvider: EnumAuthProviderType;
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  serverSettings: ServerSettings;
  serviceTemplateVersion?: Maybe<ServiceTemplateVersion>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ServiceSettingsUpdateInput = {
  adminUISettings: AdminUiSettingsUpdateInput;
  authEntityName?: InputMaybe<Scalars['String']['input']>;
  authProvider: EnumAuthProviderType;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  serverSettings: ServerSettingsUpdateInput;
};

export type ServiceTemplateCreateInput = {
  plugins?: InputMaybe<PluginInstallationsCreateInput>;
  resource: ResourceCreateInput;
};

export type ServiceTemplateVersion = {
  serviceTemplateId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type ServiceTopics = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  messageBrokerId: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  patterns: Array<MessagePattern>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type ServiceTopicsCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  messageBrokerId: Scalars['String']['input'];
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
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled: Scalars['Boolean']['input'];
  messageBrokerId: Scalars['String']['input'];
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
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  workspaceName: Scalars['String']['input'];
};

export type SignupPreviewAccountInput = {
  previewAccountEmail: Scalars['String']['input'];
  previewAccountType: EnumPreviewAccountType;
};

export type SignupWithBusinessEmailInput = {
  email: Scalars['String']['input'];
};

export enum SortOrder {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  assistantMessageUpdated: AssistantMessageDelta;
};


export type SubscriptionAssistantMessageUpdatedArgs = {
  threadId: Scalars['String']['input'];
};

export type Team = {
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  members?: Maybe<Array<User>>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TeamCreateInput = {
  name: Scalars['String']['input'];
};

export type TeamOrderByInput = {
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type TeamUpdateInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TeamUpdateMembersInput = {
  userIds: Array<Scalars['String']['input']>;
};

export type TeamWhereInput = {
  deletedAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringFilter>;
};

export type Topic = IBlock & {
  blockType: EnumBlockType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputParameters: Array<BlockInputOutput>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedByUser?: Maybe<User>;
  lockedByUserId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputParameters: Array<BlockInputOutput>;
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  versionNumber: Scalars['Float']['output'];
};

export type TopicCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  inputParameters?: InputMaybe<Array<BlockInputOutputInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UsageInsights = {
  results: Array<Metrics>;
};

export type UsageInsightsResult = {
  builds: UsageInsights;
  entities: UsageInsights;
  moduleActions: UsageInsights;
  plugins: UsageInsights;
};

export type User = {
  account?: Maybe<Account>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isOwner: Scalars['Boolean']['output'];
  lastActive?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userRoles?: Maybe<Array<UserRole>>;
  workspace?: Maybe<Workspace>;
};

export type UserAction = {
  action?: Maybe<Action>;
  actionId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  resource?: Maybe<Resource>;
  resourceId: Scalars['String']['output'];
  status?: Maybe<EnumUserActionStatus>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userActionType: EnumUserActionType;
  userId: Scalars['String']['output'];
};

export type UserRole = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};

export type WhereBlueprintRelationUniqueInput = {
  blueprint: WhereUniqueInput;
  relationKey: Scalars['String']['input'];
};

export type WhereCustomPropertyOptionUniqueInput = {
  customProperty: WhereUniqueInput;
  value: Scalars['String']['input'];
};

export type WhereEnumMemberUniqueInput = {
  enumMemberName: Scalars['String']['input'];
  moduleDto: WhereUniqueInput;
};

export type WhereParentIdInput = {
  connect: WhereUniqueInput;
};

export type WherePrivatePluginVersionUniqueInput = {
  privatePlugin: WhereUniqueInput;
  version: Scalars['String']['input'];
};

export type WherePropertyUniqueInput = {
  moduleDto: WhereUniqueInput;
  propertyName: Scalars['String']['input'];
};

export type WhereUniqueInput = {
  id: Scalars['String']['input'];
};

export type Workspace = {
  allowLLMFeatures: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  externalId?: Maybe<Scalars['String']['output']>;
  gitOrganizations?: Maybe<Array<GitOrganization>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  projects: Array<Project>;
  subscription?: Maybe<WorkspaceSubscription>;
  updatedAt: Scalars['DateTime']['output'];
  users: Array<User>;
};

export type WorkspaceCreateInput = {
  name: Scalars['String']['input'];
};

export type WorkspaceMember = {
  member: WorkspaceMemberType;
  type: EnumWorkspaceMemberType;
};

export type WorkspaceMemberType = Invitation | User;

export type WorkspaceSubscription = {
  cancelUrl?: Maybe<Scalars['String']['output']>;
  cancellationEffectiveDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  nextBillDate?: Maybe<Scalars['DateTime']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  status: EnumSubscriptionStatus;
  subscriptionPlan: EnumSubscriptionPlan;
  updateUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars['String']['output'];
};

export type WorkspaceUpdateInput = {
  allowLLMFeatures?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationGitHubMutationVariables = Exact<{
  installationId: Scalars['String']['input'];
  gitProvider: EnumGitProvider;
}>;


export type CreateOrganizationGitHubMutation = { createOrganization: { id: string, name: string } };

export type CreateOrganizationAwsCodeCommitMutationVariables = Exact<{
  gitProvider: EnumGitProvider;
  accessKeyId: Scalars['String']['input'];
  accessKeySecret: Scalars['String']['input'];
  gitPassword: Scalars['String']['input'];
  region: Scalars['String']['input'];
  gitUsername: Scalars['String']['input'];
}>;


export type CreateOrganizationAwsCodeCommitMutation = { createOrganization: { id: string, name: string } };

export type CompleteGitOAuth2FlowMutationVariables = Exact<{
  code: Scalars['String']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
  gitProvider: EnumGitProvider;
}>;


export type CompleteGitOAuth2FlowMutation = { completeGitOAuth2Flow: { id: string, name: string } };


export const CreateOrganizationGitHubDocument = gql`
    mutation createOrganizationGitHub($installationId: String!, $gitProvider: EnumGitProvider!) {
  createOrganization(
    data: {gitProvider: $gitProvider, githubInput: {installationId: $installationId}}
  ) {
    id
    name
  }
}
    `;
export type CreateOrganizationGitHubMutationFn = Apollo.MutationFunction<CreateOrganizationGitHubMutation, CreateOrganizationGitHubMutationVariables>;

/**
 * __useCreateOrganizationGitHubMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationGitHubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationGitHubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationGitHubMutation, { data, loading, error }] = useCreateOrganizationGitHubMutation({
 *   variables: {
 *      installationId: // value for 'installationId'
 *      gitProvider: // value for 'gitProvider'
 *   },
 * });
 */
export function useCreateOrganizationGitHubMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationGitHubMutation, CreateOrganizationGitHubMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationGitHubMutation, CreateOrganizationGitHubMutationVariables>(CreateOrganizationGitHubDocument, options);
      }
export type CreateOrganizationGitHubMutationHookResult = ReturnType<typeof useCreateOrganizationGitHubMutation>;
export type CreateOrganizationGitHubMutationResult = Apollo.MutationResult<CreateOrganizationGitHubMutation>;
export type CreateOrganizationGitHubMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationGitHubMutation, CreateOrganizationGitHubMutationVariables>;
export const CreateOrganizationAwsCodeCommitDocument = gql`
    mutation createOrganizationAwsCodeCommit($gitProvider: EnumGitProvider!, $accessKeyId: String!, $accessKeySecret: String!, $gitPassword: String!, $region: String!, $gitUsername: String!) {
  createOrganization(
    data: {gitProvider: $gitProvider, awsCodeCommitInput: {accessKeyId: $accessKeyId, accessKeySecret: $accessKeySecret, gitPassword: $gitPassword, region: $region, gitUsername: $gitUsername}}
  ) {
    id
    name
  }
}
    `;
export type CreateOrganizationAwsCodeCommitMutationFn = Apollo.MutationFunction<CreateOrganizationAwsCodeCommitMutation, CreateOrganizationAwsCodeCommitMutationVariables>;

/**
 * __useCreateOrganizationAwsCodeCommitMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationAwsCodeCommitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationAwsCodeCommitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationAwsCodeCommitMutation, { data, loading, error }] = useCreateOrganizationAwsCodeCommitMutation({
 *   variables: {
 *      gitProvider: // value for 'gitProvider'
 *      accessKeyId: // value for 'accessKeyId'
 *      accessKeySecret: // value for 'accessKeySecret'
 *      gitPassword: // value for 'gitPassword'
 *      region: // value for 'region'
 *      gitUsername: // value for 'gitUsername'
 *   },
 * });
 */
export function useCreateOrganizationAwsCodeCommitMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationAwsCodeCommitMutation, CreateOrganizationAwsCodeCommitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationAwsCodeCommitMutation, CreateOrganizationAwsCodeCommitMutationVariables>(CreateOrganizationAwsCodeCommitDocument, options);
      }
export type CreateOrganizationAwsCodeCommitMutationHookResult = ReturnType<typeof useCreateOrganizationAwsCodeCommitMutation>;
export type CreateOrganizationAwsCodeCommitMutationResult = Apollo.MutationResult<CreateOrganizationAwsCodeCommitMutation>;
export type CreateOrganizationAwsCodeCommitMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationAwsCodeCommitMutation, CreateOrganizationAwsCodeCommitMutationVariables>;
export const CompleteGitOAuth2FlowDocument = gql`
    mutation completeGitOAuth2Flow($code: String!, $state: String, $gitProvider: EnumGitProvider!) {
  completeGitOAuth2Flow(
    data: {code: $code, gitProvider: $gitProvider, state: $state}
  ) {
    id
    name
  }
}
    `;
export type CompleteGitOAuth2FlowMutationFn = Apollo.MutationFunction<CompleteGitOAuth2FlowMutation, CompleteGitOAuth2FlowMutationVariables>;

/**
 * __useCompleteGitOAuth2FlowMutation__
 *
 * To run a mutation, you first call `useCompleteGitOAuth2FlowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteGitOAuth2FlowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeGitOAuth2FlowMutation, { data, loading, error }] = useCompleteGitOAuth2FlowMutation({
 *   variables: {
 *      code: // value for 'code'
 *      state: // value for 'state'
 *      gitProvider: // value for 'gitProvider'
 *   },
 * });
 */
export function useCompleteGitOAuth2FlowMutation(baseOptions?: Apollo.MutationHookOptions<CompleteGitOAuth2FlowMutation, CompleteGitOAuth2FlowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteGitOAuth2FlowMutation, CompleteGitOAuth2FlowMutationVariables>(CompleteGitOAuth2FlowDocument, options);
      }
export type CompleteGitOAuth2FlowMutationHookResult = ReturnType<typeof useCompleteGitOAuth2FlowMutation>;
export type CompleteGitOAuth2FlowMutationResult = Apollo.MutationResult<CompleteGitOAuth2FlowMutation>;
export type CompleteGitOAuth2FlowMutationOptions = Apollo.BaseMutationOptions<CompleteGitOAuth2FlowMutation, CompleteGitOAuth2FlowMutationVariables>;