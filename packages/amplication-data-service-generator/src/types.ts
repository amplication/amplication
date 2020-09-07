import { Entity, EntityField } from "./models";

export type EntityWithFields = Entity & { fields: EntityField[] };
