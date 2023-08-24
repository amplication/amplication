import { builders, namedTypes } from "ast-types";
import {
  FieldKind,
  ObjectField,
  ScalarField,
  ScalarType,
} from "prisma-schema-dsl-types";
import { createEnumName } from "../../../prisma/create-prisma-schema-fields";
import { Entity, EntityField } from "@amplication/code-gen-types";
import {
  isRelationField,
  isToManyRelationField,
} from "../../../../utils/field";
import {
  BOOLEAN_ID,
  DATE_ID,
  getFilterASTIdentifier,
  NULLABLE_ID,
  FLOAT_ID,
  GRAPHQL_BIGINT_ID,
  STRING_ID,
  TRUE_LITERAL,
  NUMBER_ID,
} from "../create-field-class-property";
import { createWhereUniqueInputID } from "../create-where-unique-input";
import { GRAPHQL_JSON_ID } from "../graphql-type-json.util";
import { createCreateNestedManyWithoutInputID } from "../nested-input-dto/create-nested";
import { createUpdateManyWithoutInputID } from "../nested-input-dto/update-nested";
import { EntityDtoTypeEnum } from "../entity-dto-type-enum";
import { FIELD_ID } from "../nestjs-graphql.util";
import { createEntityListRelationFilterID } from "../graphql/entity-list-relation-filter/create-entity-list-relation-filter";

export function createGraphQLFieldDecorator(
  prismaField: ScalarField | ObjectField,
  isEnum: boolean,
  field: EntityField,
  optional: boolean,
  entity: Entity,
  isQuery: boolean,
  dtoType: EntityDtoTypeEnum,
  isNestedInput: boolean
): namedTypes.Decorator {
  const type = builders.arrowFunctionExpression(
    [],
    createGraphQLFieldType(
      prismaField,
      field,
      isEnum,
      entity,
      isQuery,
      dtoType,
      entity.pluralName,
      isNestedInput
    )
  );
  return builders.decorator(
    builders.callExpression(
      FIELD_ID,
      optional || isQuery || !field.required
        ? [
            type,
            builders.objectExpression([
              builders.objectProperty(NULLABLE_ID, TRUE_LITERAL),
            ]),
          ]
        : [type]
    )
  );
}

function createGraphQLFieldType(
  prismaField: ScalarField | ObjectField,
  field: EntityField,
  isEnum: boolean,
  entity: Entity,
  isQuery: boolean,
  dtoType: EntityDtoTypeEnum,
  entityPluralName: string,
  isNestedInput: boolean
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (prismaField.isList && (!isToManyRelationField(field) || isNestedInput)) {
    const itemType = createGraphQLFieldType(
      { ...prismaField, isList: false },
      field,
      isEnum,
      entity,
      isQuery,
      dtoType,
      entityPluralName,
      isNestedInput
    );
    return builders.arrayExpression([itemType]);
  }
  if (isQuery && prismaField.kind === FieldKind.Scalar) {
    return getFilterASTIdentifier(field.required, prismaField.type);
  }

  if (prismaField.type === ScalarType.Boolean) {
    return BOOLEAN_ID;
  }
  if (prismaField.type === ScalarType.DateTime) {
    return DATE_ID;
  }
  if (
    prismaField.type === ScalarType.Int ||
    prismaField.type === ScalarType.Float
  ) {
    return NUMBER_ID;
  }
  if (prismaField.type === ScalarType.Decimal) {
    return FLOAT_ID;
  }
  if (prismaField.type === ScalarType.BigInt) {
    return GRAPHQL_BIGINT_ID;
  }
  if (prismaField.type === ScalarType.String) {
    return STRING_ID;
  }
  if (prismaField.type === ScalarType.Json) {
    return GRAPHQL_JSON_ID;
  }
  if (isEnum) {
    const enumId = builders.identifier(createEnumName(field, entity));
    return enumId;
  }
  if (isRelationField(field)) {
    if (isNestedInput) {
      return createWhereUniqueInputID(prismaField.type);
    }
    if (isToManyRelationField(field)) {
      switch (dtoType) {
        case EntityDtoTypeEnum.CreateInput:
          return createCreateNestedManyWithoutInputID(
            entityPluralName,
            field.properties.relatedEntity.name
          );

        case EntityDtoTypeEnum.UpdateInput:
          return createUpdateManyWithoutInputID(
            entityPluralName,
            field.properties.relatedEntity.name
          );

        case EntityDtoTypeEnum.WhereInput:
          return createEntityListRelationFilterID(prismaField.type);
        default:
          throw new Error("Invalid EntityDtoType");
      }
    }
    return createWhereUniqueInputID(prismaField.type);
  }

  throw new Error("Could not create GraphQL Field type");
}
