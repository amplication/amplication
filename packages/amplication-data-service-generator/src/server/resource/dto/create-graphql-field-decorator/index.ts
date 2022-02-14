import {
  FieldKind,
  ObjectField,
  ScalarField,
  ScalarType,
} from "prisma-schema-dsl";
import { EntityField, Entity } from "../../../../types";
import { InputTypeEnum } from "../create-input";
import { builders, namedTypes } from "ast-types";
import { FIELD_ID } from "../nestjs-graphql.util";
import {
  BOOLEAN_ID,
  DATE_ID,
  getFilterASTIdentifier,
  NULLABLE_ID,
  NUMBER_ID,
  STRING_ID,
  TRUE_LITERAL,
} from "../create-field-class-property";
import { isRelationField, isToManyRelationField } from "../../../../util/field";
import { GRAPHQL_JSON_OBJECT_ID } from "../graphql-type-json.util";
import { createEnumName } from "../../../../server/prisma/create-prisma-schema";
import { createWhereUniqueInputID } from "../create-where-unique-input";
import { createCreateNestedManyWithoutInputID } from "../to-many/create-create-nested-many-without-input";
import { createUpdateManyWithoutInputID } from "../to-many/create-update-many-without-input";

export function createGraphQLFieldDecorator(
  prismaField: ScalarField | ObjectField,
  isEnum: boolean,
  field: EntityField,
  optional: boolean,
  entity: Entity,
  isQuery: boolean,
  inputType: InputTypeEnum | null,
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
      inputType,
      entity.pluralDisplayName,
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
  inputType: InputTypeEnum | null,
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
      inputType,
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
    prismaField.type === ScalarType.Float ||
    prismaField.type === ScalarType.Int
  ) {
    return NUMBER_ID;
  }
  if (prismaField.type === ScalarType.String) {
    return STRING_ID;
  }
  if (prismaField.type === ScalarType.Json) {
    return GRAPHQL_JSON_OBJECT_ID;
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
      switch (inputType) {
        case InputTypeEnum.Create:
          return createCreateNestedManyWithoutInputID(
            entityPluralName,
            field.properties.relatedEntity.name
          );

        case InputTypeEnum.Update:
          return createUpdateManyWithoutInputID(
            entityPluralName,
            field.properties.relatedEntity.name
          );
        default:
          throw new Error("Didn't got an input type");
      }
    }
    return createWhereUniqueInputID(prismaField.type);
  }

  throw new Error("Could not create GraphQL Field type");
}
