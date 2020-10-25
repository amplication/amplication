import { builders, namedTypes } from "ast-types";
import { Entity } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isEditableField } from "./field.util";

export function createCreateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) =>
      createFieldClassProperty(field, !field.required, true, entityIdToName)
    );
  return builders.classDeclaration(
    createCreateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}
