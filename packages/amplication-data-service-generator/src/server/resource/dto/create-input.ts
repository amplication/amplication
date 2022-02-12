import { builders, namedTypes } from "ast-types";
import { Entity, EntityField } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { INPUT_TYPE_DECORATOR } from "./nestjs-graphql.util";

export enum InputTypeEnum {
  Create = "create",
  Update = "update",
  Where = "where",
  WhereUnique = "whereUnique",
  NotInput = "not",
}

export function createInput(
  id: namedTypes.Identifier,
  fields: EntityField[],
  entity: Entity,
  allFieldsOptional: boolean,
  isQuery: boolean,
  inputType: InputTypeEnum
): NamedClassDeclaration {
  const properties = fields.map((field) =>
    createFieldClassProperty(
      field,
      entity,
      allFieldsOptional || !field.required,
      true,
      isQuery,
      false,
      inputType
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
