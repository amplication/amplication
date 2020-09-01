import { Entity, EntityField } from "./models";

export type EntityWithFields = Entity & { fields: EntityField[] };

export type LookupProperties = {
  relatedEntityId: string;
  allowMultipleSelection: boolean;
};
