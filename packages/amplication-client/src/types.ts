/** @todo share code with server */
import { EnumDataType } from "./entityFieldProperties/EnumDataType";

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
  fields: EntityField[];
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
  name: string;
  blockType: keyof typeof EnumBlockType;
  versionNumber: number;
  description: string;
};
