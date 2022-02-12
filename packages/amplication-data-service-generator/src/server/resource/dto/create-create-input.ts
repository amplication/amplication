import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";
import { isEditableField } from "../../../util/field";
import { createInput, InputTypeEnum } from "./create-input";

export function createCreateInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter(isEditableField);
  return createInput(
    createCreateInputID(entity.name),
    fields,
    entity,
    false,
    false,
    InputTypeEnum.Create
  );
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}
