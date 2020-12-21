import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isEditableField } from "../../../util/field";
import { INPUT_TYPE_ID } from "./nestjs-graphql.util";
import { createInput } from "./create-input";

export function createUpdateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) =>
      createFieldClassProperty(field, true, true, false, entityIdToName)
    );
  return createInput(
    classDeclaration(
      createUpdateInputID(entity.name),
      builders.classBody(properties),
      null,
      [builders.decorator(builders.callExpression(INPUT_TYPE_ID, []))]
    ) as NamedClassDeclaration
  );
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}
