import { builders } from "ast-types";
import { Entity } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { isPasswordField } from "../../../util/field";
import { createFieldClassProperty } from "./create-field-class-property";
import { OBJECT_TYPE_ID } from "./nestjs-graphql.util";

export const OBJECT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(OBJECT_TYPE_ID, [])
);

export function createEntityDTO(entity: Entity): NamedClassDeclaration {
  // make all the ast properties that inject to the entity class
  const properties = entity.fields
    .filter((field) => !isPasswordField(field))
    .map((field) =>
      createFieldClassProperty(
        field,
        entity,
        !field.required,
        false,
        false,
        true
      )
    );
  return classDeclaration(
    builders.identifier(entity.name), //name of the class
    builders.classBody(properties), // body of the class
    null, // super class
    [OBJECT_TYPE_DECORATOR] // class decorator
  ) as NamedClassDeclaration;
}
