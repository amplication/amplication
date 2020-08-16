import { Entity, EntityField } from "./models";

export type EntityWithFields = Entity & { fields: EntityField[] };

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
