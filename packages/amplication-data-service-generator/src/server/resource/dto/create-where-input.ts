import { builders, namedTypes } from "ast-types";
import { Entity, EntityField } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";
import {
  isRelationField,
  isOneToOneRelationField,
  isScalarListField,
  isPasswordField,
} from "../../../util/field";
import { createInput } from "./create-input";

export function createWhereInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter((field) => isQueryableField(field));
  return createInput(
    createWhereInputID(entity.name),
    fields,
    entity,
    true,
    true
  );
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function isQueryableField(field: EntityField): boolean {
  return (
    field.searchable &&
    !isScalarListField(field) &&
    (!isRelationField(field) || isOneToOneRelationField(field)) &&
    !isPasswordField(field)
  );
}
