import {
  Entity,
  EntityField,
  EntityPermission,
} from "@amplication/code-gen-types";

const displayName = "displayName";
const id = "id";
const name = "ClassName";
const description = "description";
const pluralDisplayName = "pluralDisplayName";
const pluralName = "pluralName";
const permissions: EntityPermission[] = [];
const fields: EntityField[] = [];
/**
 * this is the default properties for a blank entity
 */
const defaultEntity: Entity = {
  displayName,
  pluralName,
  id,
  name,
  description,
  pluralDisplayName,
  permissions,
  fields,
};
Object.freeze(defaultEntity);

export default defaultEntity;
