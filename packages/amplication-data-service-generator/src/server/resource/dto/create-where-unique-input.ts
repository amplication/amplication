import { builders, namedTypes } from "ast-types";
import { Entity, EntityField, EnumDataType } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";
import { createInput } from "./create-input";

export function createWhereUniqueInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter(isUniqueField);
  return createInput(
    createWhereUniqueInputID(entity.name),
    fields,
    entity,
    false,
    false //do not use as query since the ID field in WhereUniqueInput is required
  );
}

export function createWhereUniqueInputID(
  entityName: string
): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereUniqueInput`);
}

export function isUniqueField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Id;
}
