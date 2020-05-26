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
};

export type Entity = {
  id: string;
  name: string;
  fields: EntityField[];
};
