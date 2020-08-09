/** @todo share code with server */
import { EnumDataType } from "./entityFieldProperties/EnumDataType";

export type App = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
};

export type Account = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string;
  lastName: string;
};

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
};

export type EntityField = {
  id: string;
  name: string;
  dataType: EnumDataType;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  properties: Object;
  required: boolean;
  searchable: boolean;
  description: string;
};

export type Entity = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  versionNumber: number;
  pluralDisplayName: string;
  fields: EntityField[];
  lockedByUserId: string;
  lockedByUser: User;
  lockedAt: Date;
  entityVersions: EntityVersion[];
};

export type EntityVersion = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  versionNumber: number;
  commit?: Commit;
};

export type Commit = {
  id: string;
  createdAt: Date;
  App: App;
  userId: string;
  user?: User;
  message: string;
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

export type Block = {
  id: string;
  displayName: string;
  blockType: keyof typeof EnumBlockType;
  versionNumber: number;
  description: string;
};

export enum OrderByArg {
  asc = "asc",
  desc = "desc",
}

export enum EnumEntityPageType {
  SingleRecord = "SingleRecord",
  List = "List",
  MasterDetails = "MasterDetails",
}

export type EntityPageSingleRecordSettings = {
  allowCreation: boolean;
  allowDeletion: boolean;
  allowUpdate: boolean;
};

export type EntityPageListSettings = {
  enableSearch: boolean;
  navigateToPageId: string;
};

export type EntityPage = {
  id: string;
  displayName: string;
  blockType: keyof typeof EnumBlockType;
  versionNumber: number;
  description: string;
  entityId: string;
  pageType: EnumEntityPageType;
  singleRecordSettings?: EntityPageSingleRecordSettings;
  listSettings?: EntityPageListSettings;
  showAllFields: boolean;
  showFieldList: string[];
};
