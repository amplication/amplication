import { Entity, EntityField, EntityPermission } from "../../../../../types";

const displayName = "displayName";
const id = "id";
const name = "ClassName";
const description = "description";
const pluralDisplayName = "pluralDisplayName";
const permissions: EntityPermission[] = [];
const fields: EntityField[] = [];
/**
 * this is the default properties for a blank entity
 */
const defaultEntity: Entity = {
  displayName,
  id,
  name,
  description,
  pluralDisplayName,
  permissions,
  fields,
};
Object.freeze(defaultEntity);

export default defaultEntity;
