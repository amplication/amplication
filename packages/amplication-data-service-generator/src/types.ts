import { Entity, EntityField } from "./models";

export type EntityWithFields = Entity & { fields: EntityField[] };

export type LookupProperties = {
  relatedEntityId: string;
  allowMultipleSelection: boolean;
};

export type OptionSetProperties = {
  options: Array<{ value: string; label: string }>;
};
