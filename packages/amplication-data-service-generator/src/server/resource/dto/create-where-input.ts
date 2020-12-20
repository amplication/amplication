import { builders, namedTypes } from "ast-types";
import { Entity, EntityField } from "../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import {
  isRelationField,
  isOneToOneRelationField,
  isScalarListField,
  isPasswordField,
} from "../../../util/field";
import { INPUT_TYPE_ID } from "./nestjs-graphql.util";

export function createWhereInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter((field) => isQueryableField(field))
    /** @todo support filters */
    .map((field) =>
      createFieldClassProperty(field, true, true, true, entityIdToName)
    );
  return classDeclaration(
    createWhereInputID(entity.name),
    builders.classBody(properties),
    null,
    [builders.decorator(builders.callExpression(INPUT_TYPE_ID, []))]
  ) as NamedClassDeclaration;
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function isQueryableField(field: EntityField): boolean {
  return (
    !isScalarListField(field) &&
    (!isRelationField(field) || isOneToOneRelationField(field)) &&
    !isPasswordField(field)
  );
}
