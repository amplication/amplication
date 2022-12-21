import { builders, namedTypes } from "ast-types";
import {
  Entity,
  EntityField,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { isScalarListField, isPasswordField } from "../../../util/field";
import { createInput } from "./create-input";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";

export function createWhereInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter((field) => isQueryableField(field));
  return createInput(
    createWhereInputID(entity.name),
    fields,
    entity,
    true,
    true,
    EntityDtoTypeEnum.WhereInput
  );
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function isQueryableField(field: EntityField): boolean {
  return (
    field.searchable && !isScalarListField(field) && !isPasswordField(field)
  );
}
