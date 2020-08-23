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
  /** Date custom scalar type */
  Date: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Account = {
  __typename?: "Account";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
};

export type App = {
  __typename?: "App";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  name: Scalars["String"];
  description: Scalars["String"];
  entities: Array<Entity>;
};

export type AppCreateInput = {
  name: Scalars["String"];
  description: Scalars["String"];
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
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  account: Account;
};

export type Block = {
  __typename?: "Block";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  createdAt: Scalars["Date"];
  app: App;
  appId: Scalars["String"];
  createdBy: User;
  userId: Scalars["String"];
  status: EnumBuildStatus;
};

export type BuildCreateInput = {
  app: WhereParentIdInput;
};

export type BuildOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  userId?: Maybe<SortOrder>;
  status?: Maybe<SortOrder>;
};

export type BuildWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  app: WhereUniqueInput;
  status?: Maybe<EnumBuildStatusFilter>;
  createdBy?: Maybe<WhereUniqueInput>;
};

export type ChangePasswordInput = {
  oldPassword: Scalars["String"];
  newPassword: Scalars["String"];
};

export type Commit = {
  __typename?: "Commit";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  userId: Scalars["String"];
  user?: Maybe<User>;
  message: Scalars["String"];
};

export type CommitCreateInput = {
  message: Scalars["String"];
  app: WhereParentIdInput;
};

export type ConnectorRestApi = IBlock & {
  __typename?: "ConnectorRestApi";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  equals?: Maybe<Scalars["Date"]>;
  not?: Maybe<Scalars["Date"]>;
  in?: Maybe<Array<Scalars["Date"]>>;
  notIn?: Maybe<Array<Scalars["Date"]>>;
  lt?: Maybe<Scalars["Date"]>;
  lte?: Maybe<Scalars["Date"]>;
  gt?: Maybe<Scalars["Date"]>;
  gte?: Maybe<Scalars["Date"]>;
};

export type Entity = {
  __typename?: "Entity";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  app?: Maybe<App>;
  appId: Scalars["String"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  isPersistent: Scalars["Boolean"];
  allowFeedback: Scalars["Boolean"];
  primaryField?: Maybe<Scalars["String"]>;
  entityVersions?: Maybe<Array<EntityVersion>>;
  fields?: Maybe<Array<EntityField>>;
  permissions?: Maybe<Array<EntityPermission>>;
  lockedByUserId?: Maybe<Scalars["String"]>;
  lockedByUser?: Maybe<User>;
  lockedAt?: Maybe<Scalars["Date"]>;
};

export type EntityEntityVersionsArgs = {
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

export type EntityAddPermissionRoleInput = {
  action: EnumEntityAction;
  appRole: WhereParentIdInput;
  entity: WhereParentIdInput;
};

export type EntityCreateInput = {
  name: Scalars["String"];
  displayName: Scalars["String"];
  pluralDisplayName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  isPersistent: Scalars["Boolean"];
  allowFeedback: Scalars["Boolean"];
  primaryField?: Maybe<Scalars["String"]>;
  app: WhereParentIdInput;
};

export type EntityField = {
  __typename?: "EntityField";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  dataType: EnumDataType;
  properties?: Maybe<Scalars["JSONObject"]>;
  required: Scalars["Boolean"];
  searchable: Scalars["Boolean"];
  description: Scalars["String"];
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
};

export type EntityFieldFilter = {
  every?: Maybe<EntityFieldWhereInput>;
  some?: Maybe<EntityFieldWhereInput>;
  none?: Maybe<EntityFieldWhereInput>;
};

export type EntityFieldOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  displayName?: Maybe<SortOrder>;
  dataType?: Maybe<SortOrder>;
  required?: Maybe<SortOrder>;
  searchable?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
};

export type EntityFieldUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  dataType?: Maybe<EnumDataType>;
  properties?: Maybe<Scalars["JSONObject"]>;
  required?: Maybe<Scalars["Boolean"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
};

export type EntityFieldWhereInput = {
  id?: Maybe<StringFilter>;
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
  isPersistent?: Maybe<SortOrder>;
  allowFeedback?: Maybe<SortOrder>;
  primaryField?: Maybe<SortOrder>;
};

export type EntityPage = IBlock & {
  __typename?: "EntityPage";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  entityId: Scalars["String"];
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
  entityId: Scalars["String"];
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
  roles?: Maybe<Array<EntityPermissionRole>>;
  fields?: Maybe<Array<EntityPermissionField>>;
};

export type EntityPermissionField = {
  __typename?: "EntityPermissionField";
  id: Scalars["String"];
  entityPermissionId: Scalars["String"];
  entityPermission?: Maybe<EntityPermission>;
  fieldId: Scalars["String"];
  field: EntityField;
};

export type EntityPermissionFieldWhereUniqueInput = {
  entityId: Scalars["String"];
  action: EnumEntityAction;
  fieldName: Scalars["String"];
};

export type EntityPermissionRole = {
  __typename?: "EntityPermissionRole";
  entityPermissionId: Scalars["String"];
  entityPermission?: Maybe<EntityPermission>;
  appRoleId: Scalars["String"];
  appRole: AppRole;
};

export type EntityPermissionRoleWhereUniqueInput = {
  entityId: Scalars["String"];
  action: EnumEntityAction;
  appRoleId: Scalars["String"];
};

export type EntityUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  pluralDisplayName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  isPersistent?: Maybe<Scalars["Boolean"]>;
  allowFeedback?: Maybe<Scalars["Boolean"]>;
  primaryField?: Maybe<Scalars["String"]>;
};

export type EntityUpdatePermissionInput = {
  action: EnumEntityAction;
  type: EnumEntityPermissionType;
};

export type EntityVersion = {
  __typename?: "EntityVersion";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  entityId: Scalars["String"];
  entity: Entity;
  versionNumber: Scalars["Int"];
  commit?: Maybe<Commit>;
  fields: Array<EntityField>;
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
  label?: Maybe<SortOrder>;
};

export type EntityVersionWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  versionNumber?: Maybe<IntFilter>;
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
  isPersistent?: Maybe<BooleanFilter>;
  allowFeedback?: Maybe<BooleanFilter>;
  primaryField?: Maybe<StringFilter>;
  fields?: Maybe<EntityFieldFilter>;
  app?: Maybe<WhereUniqueInput>;
};

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
  Completed = "Completed",
  Waiting = "Waiting",
  Active = "Active",
  Delayed = "Delayed",
  Failed = "Failed",
  Paused = "Paused",
}

export type EnumBuildStatusFilter = {
  equals?: Maybe<EnumBuildStatus>;
  not?: Maybe<EnumBuildStatus>;
  in?: Maybe<Array<EnumBuildStatus>>;
  notIn?: Maybe<Array<EnumBuildStatus>>;
};

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
  State = "State",
  AutoNumber = "AutoNumber",
  WholeNumber = "WholeNumber",
  DateTime = "DateTime",
  DecimalNumber = "DecimalNumber",
  File = "File",
  Image = "Image",
  Lookup = "Lookup",
  MultiSelectOptionSet = "MultiSelectOptionSet",
  OptionSet = "OptionSet",
  TwoOptions = "TwoOptions",
  Boolean = "Boolean",
  GeographicAddress = "GeographicAddress",
  Id = "Id",
  CreatedAt = "CreatedAt",
  UpdatedAt = "UpdatedAt",
}

export type EnumDataTypeFilter = {
  equals?: Maybe<EnumDataType>;
  not?: Maybe<EnumDataType>;
  in?: Maybe<Array<EnumDataType>>;
  notIn?: Maybe<Array<EnumDataType>>;
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
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
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
  deleteOrganization?: Maybe<Organization>;
  updateOrganization?: Maybe<Organization>;
  inviteUser?: Maybe<User>;
  createApp: App;
  deleteApp?: Maybe<App>;
  updateApp?: Maybe<App>;
  commit?: Maybe<Commit>;
  assignRoleToUser?: Maybe<User>;
  removeRoleFromUser?: Maybe<User>;
  signup: Auth;
  login: Auth;
  changePassword: Account;
  setCurrentOrganization: Auth;
  createOneEntity: Entity;
  deleteEntity?: Maybe<Entity>;
  updateEntity?: Maybe<Entity>;
  lockEntity?: Maybe<Entity>;
  updateEntityPermission?: Maybe<EntityPermission>;
  addEntityPermissionRole?: Maybe<EntityPermissionRole>;
  deleteEntityPermissionRole?: Maybe<EntityPermissionRole>;
  addEntityPermissionField?: Maybe<EntityPermissionField>;
  deleteEntityPermissionField?: Maybe<EntityPermissionField>;
  createEntityField?: Maybe<EntityField>;
  deleteEntityField?: Maybe<EntityField>;
  updateEntityField?: Maybe<EntityField>;
  createConnectorRestApi: ConnectorRestApi;
  updateConnectorRestApi: ConnectorRestApi;
  createBlockVersion: Block;
  createConnectorRestApiCall: ConnectorRestApiCall;
  updateConnectorRestApiCall: ConnectorRestApiCall;
  createEntityPage: EntityPage;
  updateEntityPage: EntityPage;
  createAppRole: AppRole;
  deleteAppRole?: Maybe<AppRole>;
  updateAppRole?: Maybe<AppRole>;
  createBuildSignedURL: Scalars["String"];
  createBuild: Build;
};

export type MutationUpdateAccountArgs = {
  data: UpdateAccountInput;
};

export type MutationDeleteOrganizationArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateOrganizationArgs = {
  data: OrganizationUpdateInput;
  where: WhereUniqueInput;
};

export type MutationInviteUserArgs = {
  data: InviteUserInput;
};

export type MutationCreateAppArgs = {
  data: AppCreateInput;
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

export type MutationAssignRoleToUserArgs = {
  data: UserRoleInput;
  where: WhereUniqueInput;
};

export type MutationRemoveRoleFromUserArgs = {
  data: UserRoleInput;
  where: WhereUniqueInput;
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationSetCurrentOrganizationArgs = {
  data: WhereUniqueInput;
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

export type MutationAddEntityPermissionRoleArgs = {
  data: EntityAddPermissionRoleInput;
};

export type MutationDeleteEntityPermissionRoleArgs = {
  where: EntityPermissionRoleWhereUniqueInput;
};

export type MutationAddEntityPermissionFieldArgs = {
  data: EntityAddPermissionFieldInput;
};

export type MutationDeleteEntityPermissionFieldArgs = {
  where: EntityPermissionFieldWhereUniqueInput;
};

export type MutationCreateEntityFieldArgs = {
  data: EntityFieldCreateInput;
};

export type MutationDeleteEntityFieldArgs = {
  where: WhereUniqueInput;
};

export type MutationUpdateEntityFieldArgs = {
  data: EntityFieldUpdateInput;
  where: WhereUniqueInput;
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

export type MutationCreateBuildSignedUrlArgs = {
  where: WhereUniqueInput;
};

export type MutationCreateBuildArgs = {
  data: BuildCreateInput;
};

export type Organization = {
  __typename?: "Organization";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  name: Scalars["String"];
  defaultTimeZone: Scalars["String"];
  address: Scalars["String"];
  apps: Array<App>;
  users: Array<User>;
};

export type OrganizationOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  defaultTimeZone?: Maybe<SortOrder>;
  address?: Maybe<SortOrder>;
};

export type OrganizationUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  defaultTimeZone?: Maybe<Scalars["String"]>;
  address?: Maybe<Scalars["String"]>;
};

export type OrganizationWhereInput = {
  id?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  defaultTimeZone?: Maybe<StringFilter>;
  address?: Maybe<StringFilter>;
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
  me: User;
  Organization?: Maybe<Organization>;
  Organizations: Array<Organization>;
  app?: Maybe<App>;
  apps: Array<App>;
  user?: Maybe<User>;
  users: Array<User>;
  entity?: Maybe<Entity>;
  entities: Array<Entity>;
  entityVersions: Array<EntityVersion>;
  entityField?: Maybe<EntityField>;
  ConnectorRestApi?: Maybe<ConnectorRestApi>;
  ConnectorRestApis: Array<ConnectorRestApi>;
  blockVersions: Array<BlockVersion>;
  blocks: Array<Block>;
  ConnectorRestApiCall?: Maybe<ConnectorRestApiCall>;
  ConnectorRestApiCalls: Array<ConnectorRestApiCall>;
  EntityPage?: Maybe<EntityPage>;
  EntityPages: Array<EntityPage>;
  appRole?: Maybe<AppRole>;
  appRoles: Array<AppRole>;
  builds: Array<Build>;
};

export type QueryOrganizationArgs = {
  where: WhereUniqueInput;
};

export type QueryOrganizationsArgs = {
  where?: Maybe<OrganizationWhereInput>;
  orderBy?: Maybe<OrganizationOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
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

export type QueryUserArgs = {
  where: WhereUniqueInput;
};

export type QueryUsersArgs = {
  where?: Maybe<UserWhereInput>;
  orderBy?: Maybe<UserOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
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

export type QueryEntityVersionsArgs = {
  where?: Maybe<EntityVersionWhereInput>;
  orderBy?: Maybe<EntityVersionOrderByInput>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryEntityFieldArgs = {
  where: WhereUniqueInput;
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

export enum Role {
  Admin = "ADMIN",
  User = "USER",
  OrganizationAdmin = "ORGANIZATION_ADMIN",
  ProjectAdmin = "PROJECT_ADMIN",
}

export type SignupInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  organizationName: Scalars["String"];
  defaultTimeZone: Scalars["String"];
  address: Scalars["String"];
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
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
};

export type UpdateAccountInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  account?: Maybe<Account>;
  organization?: Maybe<Organization>;
  userRoles?: Maybe<Array<UserRole>>;
};

export type UserOrderByInput = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export type UserRole = {
  __typename?: "UserRole";
  id: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  role: Role;
};

export type UserRoleInput = {
  role: Role;
};

export type UserWhereInput = {
  id?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  AND?: Maybe<Array<UserWhereInput>>;
  OR?: Maybe<Array<UserWhereInput>>;
  NOT?: Maybe<Array<UserWhereInput>>;
  organization?: Maybe<OrganizationWhereInput>;
};

export type WhereParentIdInput = {
  connect: WhereUniqueInput;
};

export type WhereUniqueInput = {
  id: Scalars["String"];
};
