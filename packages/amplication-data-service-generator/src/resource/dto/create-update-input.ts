import { builders, namedTypes } from "ast-types";
import { Entity } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isEditableField } from "../../util/field";

export function createUpdateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) =>
      createFieldClassProperty(field, true, true, entityIdToName)
    );
  return builders.classDeclaration(
    createUpdateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}
