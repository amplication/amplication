import { namedTypes, builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import {
  FieldKind,
  ObjectField,
  ScalarField,
  ScalarType,
} from "prisma-schema-dsl";
import { Entity, EntityField } from "../../../types";
import {
  createEnumName,
  createPrismaFields,
} from "../../prisma/create-prisma-schema";
import { classProperty, createGenericArray } from "../../../util/ast";
import { isEnumField, isOneToOneRelationField } from "../../../util/field";
import {
  IS_BOOLEAN_ID,
  IS_DATE_ID,
  IS_ENUM_ID,
  IS_INT_ID,
  IS_NUMBER_ID,
  IS_OPTIONAL_ID,
  IS_STRING_ID,
  IS_JSON_ID,
  VALIDATE_NESTED_ID,
} from "./class-validator.util";
import { GRAPHQL_JSON_OBJECT_ID } from "./graphql-type-json.util";
import { JSON_VALUE_ID } from "./type-fest.util";
import {
  EnumScalarFiltersTypes,
  SCALAR_FILTER_TO_MODULE_AND_TYPE,
} from "./filters.util";

import * as classTransformerUtil from "./class-transformer.util";
import { API_PROPERTY_ID } from "./nestjs-swagger.util";
import { createEnumMembers } from "./create-enum-dto";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import { FIELD_ID } from "./nestjs-graphql.util";

const DATE_ID = builders.identifier("Date");

const PRISMA_SCALAR_TO_TYPE: {
  [scalar in ScalarType]: TSTypeKind;
} = {
  [ScalarType.Boolean]: builders.tsBooleanKeyword(),
  [ScalarType.DateTime]: builders.tsTypeReference(DATE_ID),
  [ScalarType.Float]: builders.tsNumberKeyword(),
  [ScalarType.Int]: builders.tsNumberKeyword(),
  [ScalarType.String]: builders.tsStringKeyword(),
  [ScalarType.Json]: builders.tsTypeReference(JSON_VALUE_ID),
};

const PRISMA_SCALAR_TO_QUERY_TYPE: {
  [scalar in ScalarType]: namedTypes.Identifier;
} = {
  [ScalarType.Boolean]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.Boolean].type,
  [ScalarType.DateTime]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.DateTime].type,
  [ScalarType.Float]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.Float].type,
  [ScalarType.Int]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.Int].type,
  [ScalarType.String]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.String].type,
  [ScalarType.Json]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.JsonNullable].type,
};

const PRISMA_SCALAR_TO_NULLABLE_QUERY_TYPE: {
  [scalar in ScalarType]: namedTypes.Identifier;
} = {
  [ScalarType.Boolean]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.BooleanNullable]
      .type,
  [ScalarType.DateTime]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.DateTimeNullable]
      .type,
  [ScalarType.Float]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.FloatNullable].type,
  [ScalarType.Int]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.IntNullable].type,
  [ScalarType.String]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.StringNullable]
      .type,
  [ScalarType.Json]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.JsonNullable].type,
};

const PRISMA_SCALAR_TO_DECORATOR_ID: {
  [scalar in ScalarType]: namedTypes.Identifier | null;
} = {
  [ScalarType.Boolean]: IS_BOOLEAN_ID,
  [ScalarType.DateTime]: IS_DATE_ID,
  [ScalarType.Float]: IS_NUMBER_ID,
  [ScalarType.Int]: IS_INT_ID,
  [ScalarType.String]: IS_STRING_ID,
  [ScalarType.Json]: IS_JSON_ID,
};
export const BOOLEAN_ID = builders.identifier("Boolean");
export const NUMBER_ID = builders.identifier("Number");
export const STRING_ID = builders.identifier("String");
const PRISMA_SCALAR_TO_SWAGGER_TYPE: {
  [scalar in ScalarType]: namedTypes.Identifier | null;
} = {
  [ScalarType.Boolean]: BOOLEAN_ID,
  [ScalarType.DateTime]: null,
  [ScalarType.Float]: NUMBER_ID,
  /** @todo specific limitations */
  [ScalarType.Int]: NUMBER_ID,
  [ScalarType.String]: STRING_ID,
  [ScalarType.Json]: null,
};
export const EACH_ID = builders.identifier("each");
export const TRUE_LITERAL = builders.booleanLiteral(true);
export const ENUM_ID = builders.identifier("enum");
export const REQUIRED_ID = builders.identifier("required");
export const TYPE_ID = builders.identifier("type");
export const JSON_ID = builders.identifier("JSON");
export const PARSE_ID = builders.identifier("parse");
export const IS_ARRAY_ID = builders.identifier("isArray");
export const NULLABLE_ID = builders.identifier("nullable");

export function createFieldClassProperty(
  field: EntityField,
  entity: Entity,
  optional: boolean,
  isInput: boolean,
  isQuery: boolean
): namedTypes.ClassProperty {
  const [prismaField] = createPrismaFields(field, entity);
  const id = builders.identifier(field.name);
  const isEnum = isEnumField(field);
  const [type, arrayElementType] = createFieldValueTypeFromPrismaField(
    field,
    prismaField,
    optional,
    isInput,
    isEnum,
    isQuery
  );
  const typeAnnotation = builders.tsTypeAnnotation(type);
  const apiPropertyOptionsObjectExpression = builders.objectExpression([
    builders.objectProperty(REQUIRED_ID, builders.booleanLiteral(!optional)),
  ]);
  const decorators: namedTypes.Decorator[] = [
    builders.decorator(
      builders.callExpression(API_PROPERTY_ID, [
        apiPropertyOptionsObjectExpression,
      ])
    ),
  ];
  if (prismaField.isList && prismaField.kind === FieldKind.Object) {
    optional = true;
  }
  //optional properties are marked with ? - not to be confused with optional fields (nullable)
  //all relation fields on entity dto (not input) are optional
  const optionalProperty =
    (prismaField.kind === FieldKind.Object && !isInput) ||
    (optional && (isInput || prismaField.kind === FieldKind.Object));

  const definitive = !optionalProperty;

  if (prismaField.kind === FieldKind.Scalar) {
    if (!isQuery) {
      const id = PRISMA_SCALAR_TO_DECORATOR_ID[prismaField.type];
      if (id) {
        const args = prismaField.isList
          ? [
              builders.objectExpression([
                builders.objectProperty(EACH_ID, TRUE_LITERAL),
              ]),
            ]
          : [];
        decorators.push(builders.decorator(builders.callExpression(id, args)));
      }
    }
    const swaggerType = !isQuery
      ? PRISMA_SCALAR_TO_SWAGGER_TYPE[prismaField.type]
      : !field.required
      ? PRISMA_SCALAR_TO_NULLABLE_QUERY_TYPE[prismaField.type]
      : PRISMA_SCALAR_TO_QUERY_TYPE[prismaField.type];

    if (swaggerType) {
      if (isQuery) {
        decorators.push(createTypeDecorator(swaggerType));
      }

      const type = prismaField.isList
        ? builders.arrayExpression([swaggerType])
        : swaggerType;
      apiPropertyOptionsObjectExpression.properties.push(
        builders.objectProperty(TYPE_ID, type)
      );
    }
  }
  if (prismaField.type === ScalarType.DateTime && !isQuery) {
    decorators.push(createTypeDecorator(DATE_ID));
  }
  if (isEnum) {
    const enumId = builders.identifier(createEnumName(field, entity));
    const enumAPIProperty = builders.objectProperty(ENUM_ID, enumId);
    const apiPropertyOptionsProperties = prismaField.isList
      ? [enumAPIProperty, builders.objectProperty(IS_ARRAY_ID, TRUE_LITERAL)]
      : [enumAPIProperty];
    apiPropertyOptionsObjectExpression.properties.push(
      ...apiPropertyOptionsProperties
    );
    const isEnumArgs = prismaField.isList
      ? [
          enumId,
          builders.objectExpression([
            builders.objectProperty(EACH_ID, TRUE_LITERAL),
          ]),
        ]
      : [enumId];
    decorators.push(
      builders.decorator(builders.callExpression(IS_ENUM_ID, isEnumArgs))
    );
  } else if (prismaField.kind === FieldKind.Object) {
    let typeName;
    if (namedTypes.TSUnionType.check(type)) {
      const objectType = type.types.find(
        (type) =>
          namedTypes.TSTypeReference.check(type) &&
          namedTypes.Identifier.check(type.typeName)
      ) as namedTypes.TSTypeReference & { typeName: namedTypes.Identifier };
      typeName = objectType.typeName;
    } else if (
      namedTypes.TSTypeReference.check(type) &&
      namedTypes.Identifier.check(type.typeName)
    ) {
      if (prismaField.isList) {
        if (
          namedTypes.TSTypeReference.check(arrayElementType) &&
          namedTypes.Identifier.check(arrayElementType.typeName)
        ) {
          typeName = arrayElementType.typeName;
        } else {
          typeName = type.typeName;
        }
      } else {
        typeName = type.typeName;
      }
    }

    if (!typeName) {
      throw new Error(`Unexpected type: ${type}`);
    }
    apiPropertyOptionsObjectExpression.properties.push(
      builders.objectProperty(
        TYPE_ID,
        builders.arrowFunctionExpression(
          [],
          prismaField.isList ? builders.arrayExpression([typeName]) : typeName
        )
      )
    );
    decorators.push(
      builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
      createTypeDecorator(typeName)
    );
  }
  if (optional) {
    decorators.push(
      builders.decorator(builders.callExpression(IS_OPTIONAL_ID, []))
    );
  }
  if (
    prismaField.kind !== FieldKind.Object ||
    isEnum ||
    (isInput && isOneToOneRelationField(field))
  ) {
    decorators.push(
      createGraphQLFieldDecorator(
        prismaField,
        isEnum,
        field,
        optionalProperty,
        entity,
        isQuery
      )
    );
  }
  return classProperty(
    id,
    typeAnnotation,
    definitive,
    optionalProperty,
    null,
    decorators
  );
}

function createGraphQLFieldDecorator(
  prismaField: ScalarField | ObjectField,
  isEnum: boolean,
  field: EntityField,
  optional: boolean,
  entity: Entity,
  isQuery: boolean
): namedTypes.Decorator {
  const type = builders.arrowFunctionExpression(
    [],
    createGraphQLFieldType(prismaField, field, isEnum, entity, isQuery)
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
  isQuery: boolean
): namedTypes.Identifier | namedTypes.ArrayExpression {
  if (prismaField.isList) {
    const itemType = createGraphQLFieldType(
      { ...prismaField, isList: false },
      field,
      isEnum,
      entity,
      isQuery
    );
    return builders.arrayExpression([itemType]);
  }
  if (isQuery && prismaField.kind === FieldKind.Scalar) {
    return !field.required
      ? PRISMA_SCALAR_TO_NULLABLE_QUERY_TYPE[prismaField.type]
      : PRISMA_SCALAR_TO_QUERY_TYPE[prismaField.type];
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
  if (isOneToOneRelationField(field)) {
    return createWhereUniqueInputID(prismaField.type);
  }
  throw new Error("Could not create GraphQL Field type");
}

export function createTypeDecorator(
  typeName: namedTypes.Identifier
): namedTypes.Decorator {
  return builders.decorator(
    builders.callExpression(classTransformerUtil.TYPE_ID, [
      builders.arrowFunctionExpression([], typeName),
    ])
  );
}

//Returns an array of max two elements
//element [0] is always the type of the property,
//element [1] is only returned when the type is an array, with the array element type
export function createFieldValueTypeFromPrismaField(
  field: EntityField,
  prismaField: ScalarField | ObjectField,
  optional: boolean,
  isInput: boolean,
  isEnum: boolean,
  isQuery: boolean
): TSTypeKind[] {
  if (!prismaField.isRequired && !isQuery) {
    const [type] = createFieldValueTypeFromPrismaField(
      field,
      {
        ...prismaField,
        isRequired: true,
      },
      optional,
      isInput,
      isEnum,
      isQuery
    );
    return [builders.tsUnionType([type, builders.tsNullKeyword()])];
  }
  if (prismaField.isList) {
    const itemPrismaField = {
      ...prismaField,
      isList: false,
    };
    const [itemType] = createFieldValueTypeFromPrismaField(
      field,
      itemPrismaField,
      optional,
      isInput,
      isEnum,
      isQuery
    );
    return [createGenericArray(itemType), itemType];
  }
  if (prismaField.kind === FieldKind.Scalar) {
    if (isQuery) {
      return [
        builders.tsTypeReference(
          !field.required
            ? PRISMA_SCALAR_TO_NULLABLE_QUERY_TYPE[prismaField.type]
            : PRISMA_SCALAR_TO_QUERY_TYPE[prismaField.type]
        ),
      ];
    } else {
      return [PRISMA_SCALAR_TO_TYPE[prismaField.type]];
    }
  }
  if (isEnum) {
    const members = createEnumMembers(field);
    return [
      builders.tsUnionType(
        members.map((member) => builders.tsLiteralType(member.initializer))
      ),
    ];
  }
  if (isQuery || isInput) {
    return [
      builders.tsTypeReference(createWhereUniqueInputID(prismaField.type)),
    ];
  } else {
    return [builders.tsTypeReference(builders.identifier(prismaField.type))];
  }
}
