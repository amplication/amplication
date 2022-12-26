import { builders, namedTypes } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { isEditableField } from "../../../util/field";
import { createInput } from "./create-input";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";

export function createCreateInput(entity: Entity): NamedClassDeclaration {
  const fields = entity.fields.filter(isEditableField);
  return createInput(
    createCreateInputID(entity.name),
    fields,
    entity,
    false,
    false,
    EntityDtoTypeEnum.CreateInput
  );
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}
