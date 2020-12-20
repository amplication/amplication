import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { isEditableField } from "../../../util/field";
import { INPUT_TYPE_ID } from "./nestjs-graphql.util";

export function createCreateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    .map((field) =>
      createFieldClassProperty(
        field,
        !field.required,
        true,
        false,
        entityIdToName
      )
    );
  return classDeclaration(
    createCreateInputID(entity.name),
    builders.classBody(properties),
    null,
    [builders.decorator(builders.callExpression(INPUT_TYPE_ID, []))]
  ) as NamedClassDeclaration;
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}
