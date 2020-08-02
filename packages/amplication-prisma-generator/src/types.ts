/** @todo share with server */
export enum EnumDataType {
  singleLineText = "singleLineText",
  multiLineText = "multiLineText",
  email = "email",
  state = "state",
  autoNumber = "autoNumber",
  wholeNumber = "wholeNumber",
  dateTime = "dateTime",
  decimalNumber = "decimalNumber",
  file = "file",
  image = "image",
  lookup = "lookup",
  multiSelectOptionSet = "multiSelectOptionSet",
  optionSet = "optionSet",
  twoOptions = "twoOptions",
  boolean = "boolean",
  uniqueId = "uniqueId",
  geographicAddress = "geographicAddress",
}

export type LookupProperties = {
  relatedEntityId: string;
  allowMultipleSelection: boolean;
};

export type OptionSetProperties = {
  optionsSetId: string;
};

export type TwoOptionsProperties = {
  firstOption: string;
  secondOption: string;
  default: string;
};

export type Field = {
  name: string;
  dataType: string;
  properties: Object;
  required: boolean;
};

export type Entity = {
  name: string;
  fields: Field[];
};
