import { builders } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { classDeclaration } from "../../../util/ast";
import { isPasswordField } from "../../../util/field";
import { createFieldClassProperty } from "./create-field-class-property";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
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
        true,
        EntityDtoTypeEnum.Entity
      )
    );
  return classDeclaration(
    builders.identifier(entity.name),
    builders.classBody(properties),
    null,
    [OBJECT_TYPE_DECORATOR]
  ) as NamedClassDeclaration;
}
