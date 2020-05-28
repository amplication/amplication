/** @todo share code with server */
import { EnumDataType } from "../entityFieldProperties/EnumDataType";

export type EntityField = {
  id: string;
  name: string;
  dataType: EnumDataType;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  properties: string;
  required: boolean;
  searchable: boolean;
  description: string;
};

export type Entity = {
  id: string;
  name: string;
  fields: EntityField[];
};
