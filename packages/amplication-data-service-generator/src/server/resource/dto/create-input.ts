import { builders, namedTypes } from "ast-types";
import { EntityField, Entity } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { INPUT_TYPE_ID } from "./nestjs-graphql.util";

const INPUT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(INPUT_TYPE_ID, [])
);

export function createInput(
  id: namedTypes.Identifier,
  fields: EntityField[],
  allFieldsOptional: boolean,
  isQuery: boolean,
  entity: Entity
): NamedClassDeclaration {
  const properties = fields.map((field) =>
    createFieldClassProperty(
      field,
      allFieldsOptional || !field.required,
      true,
      isQuery,
      entity
    )
  );
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    id,
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}
