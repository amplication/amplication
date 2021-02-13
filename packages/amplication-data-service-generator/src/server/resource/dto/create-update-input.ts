import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";
import { isEditableField } from "../../../util/field";
import { createInput } from "./create-input";

export function createUpdateInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter(isEditableField);
  return createInput(
    createUpdateInputID(entity.name),
    fields,
    entity,
    true,
    false
  );
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}
