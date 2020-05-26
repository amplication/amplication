/** @todo share code with server */

export enum EntityFieldDataType {
  singleLineText = "singleLineText",
  multiLineText = "multiLineText",
  email = "email",
  numbers = "numbers",
  autoNumber = "autoNumber",
}

export type EntityField = {
  id: string;
  name: string;
  dataType: EntityFieldDataType;
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
