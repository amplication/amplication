import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import {
  FieldKind,
  ObjectField,
  ScalarField,
  ScalarType,
} from "prisma-schema-dsl-types";
import { Entity, EntityField } from "@amplication/code-gen-types";
import { classProperty, createGenericArray } from "../../../utils/ast";
import {
  isEnumField,
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../utils/field";
import {
  createEnumName,
  createPrismaFields,
} from "../../prisma/create-prisma-schema-fields";
import { ApiPropertyDecoratorBuilder } from "./api-property-decorator";
import * as classTransformerUtil from "./class-transformer.util";
import {
  IS_BOOLEAN_ID,
  IS_DATE_ID,
  IS_ENUM_ID,
  IS_INT_ID,
  IS_JSON_VALUE_ID,
  IS_NUMBER_ID,
  IS_OPTIONAL_ID,
  IS_STRING_ID,
  VALIDATE_NESTED_ID,
} from "./class-validator.util";
import {
  DECIMAL_VALUE,
  BIG_INT_VALUE,
  INPUT_JSON_VALUE_KEY,
} from "./constants";
import { createEnumMembers } from "./create-enum-dto";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import {
  EnumScalarFiltersTypes,
  SCALAR_FILTER_TO_MODULE_AND_TYPE,
} from "./filters.util";
import { createGraphQLFieldDecorator } from "./graphql-field-decorator";
import { createCreateNestedManyWithoutInputID } from "./nested-input-dto/create-nested";
import { createUpdateManyWithoutInputID } from "./nested-input-dto/update-nested";
import { JSON_VALUE_ID } from "./type-fest.util";
import { createEntityListRelationFilterID } from "./graphql/entity-list-relation-filter/create-entity-list-relation-filter";

export const DATE_ID = builders.identifier("Date");
const PRISMA_SCALAR_TO_TYPE: {
  [scalar in ScalarType]: TSTypeKind;
} = {
  [ScalarType.Boolean]: builders.tsBooleanKeyword(),
  [ScalarType.DateTime]: builders.tsTypeReference(DATE_ID),
  [ScalarType.Float]: builders.tsNumberKeyword(),
  [ScalarType.Int]: builders.tsNumberKeyword(),
  [ScalarType.String]: builders.tsStringKeyword(),
  [ScalarType.Json]: builders.tsTypeReference(
    builders.identifier(INPUT_JSON_VALUE_KEY)
  ),
  [ScalarType.Decimal]: builders.tsTypeReference(
    builders.identifier(DECIMAL_VALUE)
  ),
  [ScalarType.BigInt]: builders.tsTypeReference(
    builders.identifier(BIG_INT_VALUE)
  ),
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
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.Json].type,
  [ScalarType.Decimal]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.Decimal].type,
  [ScalarType.BigInt]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.BigInt].type,
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
  [ScalarType.Decimal]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.DecimalNullable]
      .type,
  [ScalarType.BigInt]:
    SCALAR_FILTER_TO_MODULE_AND_TYPE[EnumScalarFiltersTypes.BigIntNullable]
      .type,
};

const PRISMA_SCALAR_TO_DECORATOR_ID: {
  [scalar in ScalarType]: namedTypes.Identifier | null;
} = {
  [ScalarType.Boolean]: IS_BOOLEAN_ID,
  [ScalarType.DateTime]: IS_DATE_ID,
  [ScalarType.Float]: IS_NUMBER_ID,
  [ScalarType.Int]: IS_INT_ID,
  [ScalarType.String]: IS_STRING_ID,
  [ScalarType.Json]: IS_JSON_VALUE_ID,
  [ScalarType.Decimal]: IS_NUMBER_ID,
  [ScalarType.BigInt]: IS_INT_ID,
};
export const BOOLEAN_ID = builders.identifier("Boolean");
export const NUMBER_ID = builders.identifier("Number");
export const FLOAT_ID = builders.identifier("Float");
export const GRAPHQL_BIGINT_ID = builders.identifier("GraphQLBigInt");
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
  [ScalarType.Decimal]: NUMBER_ID,
  [ScalarType.BigInt]: NUMBER_ID,
};
export const EACH_ID = builders.identifier("each");
export const TRUE_LITERAL = builders.booleanLiteral(true);
export const ENUM = "enum";
export const ENUM_ID = builders.identifier(ENUM);
export const REQUIRED = "required";
export const REQUIRED_ID = builders.identifier(REQUIRED);
export const TYPE = "type";
export const TYPE_ID = builders.identifier(TYPE);
export const JSON_ID = builders.identifier("JSON");
export const PARSE_ID = builders.identifier("parse");
export const IS_ARRAY_ID = builders.identifier("isArray");
export const NULLABLE_ID = builders.identifier("nullable");

/**
 *
 * create all the body of the classes of the dto like input, object, args, etc...
 * @param field
 * @param entity
 * @param optional
 * @param isQuery
 * @param isObjectType true only for the entity object type.
 * is User entity so only for the User.ts
 * @returns a property of class with all the decorators as AST object
 */
export function createFieldClassProperty(
  field: EntityField,
  entity: Entity,
  optional: boolean,
  isQuery: boolean,
  isObjectType: boolean,
  inputType: EntityDtoTypeEnum
): namedTypes.ClassProperty {
  const [prismaField] = createPrismaFields(field, entity);
  const id = builders.identifier(field.name);
  const isEnum = isEnumField(field);
  const isInput = isEntityInputExceptRelationInput(inputType);
  const [type, arrayElementType] = createFieldValueTypeFromPrismaField(
    entity.pluralName,
    field,
    prismaField,
    optional,
    isEnum,
    isQuery,
    isObjectType,
    false,
    inputType
  );
  const typeAnnotation = builders.tsTypeAnnotation(type);
  const apiPropertyDecoratorBuilder = new ApiPropertyDecoratorBuilder(
    prismaField.isList,
    isToManyRelationField(field) && !isObjectType
  );
  apiPropertyDecoratorBuilder.optional(optional);
  const decorators: namedTypes.Decorator[] = [];
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
        if (
          inputType === EntityDtoTypeEnum.WhereUniqueInput &&
          prismaField.type === ScalarType.Int
        ) {
          decorators.push(
            builders.decorator(
              builders.callExpression(builders.identifier("Transform"), [
                builders.arrowFunctionExpression(
                  [builders.identifier("prop")],
                  builders.callExpression(builders.identifier("parseInt"), [
                    builders.memberExpression(
                      builders.identifier("prop"),
                      builders.identifier("value")
                    ),
                  ])
                ),
                builders.objectExpression([
                  builders.objectProperty(
                    builders.identifier("toClassOnly"),
                    builders.booleanLiteral(true)
                  ),
                ]),
              ])
            )
          );
        }
      }
    }
    const swaggerType = !isQuery
      ? PRISMA_SCALAR_TO_SWAGGER_TYPE[prismaField.type]
      : getFilterASTIdentifier(field.required, prismaField.type);

    if (swaggerType) {
      if (isQuery) {
        decorators.push(createTypeDecorator(swaggerType));
      }
      apiPropertyDecoratorBuilder.scalarType(swaggerType);
    }
  }
  if (prismaField.type === ScalarType.DateTime && !isQuery) {
    decorators.push(createTypeDecorator(DATE_ID));
  }
  if (isEnum) {
    const enumId = builders.identifier(createEnumName(field, entity));
    apiPropertyDecoratorBuilder.enum(enumId);

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
    const typeName = getTypeName(type, arrayElementType, prismaField.isList);

    apiPropertyDecoratorBuilder.objectType(typeName);
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
    (isInput &&
      (isToManyRelationField(field) || isOneToOneRelationField(field)))
  ) {
    decorators.push(
      createGraphQLFieldDecorator(
        prismaField,
        isEnum,
        field,
        optionalProperty,
        entity,
        isQuery,
        inputType,
        false
      )
    );
  }
  decorators.unshift(apiPropertyDecoratorBuilder.build());
  return classProperty(
    id,
    typeAnnotation,
    definitive,
    optionalProperty,
    null,
    decorators
  );
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
  entityPluralName: string,
  field: EntityField,
  prismaField: ScalarField | ObjectField,
  optional: boolean,
  isEnum: boolean,
  isQuery: boolean,
  isObjectType: boolean,
  isNestedInput: boolean,
  dtoType: EntityDtoTypeEnum
): TSTypeKind[] {
  // add  "| null" to the end of the type
  if (
    !prismaField.isRequired &&
    !isQuery &&
    !(prismaField.type === ScalarType.Json) // json property cant be null
    //TODO add a ui update that make json required and remove this
  ) {
    const [type] = createFieldValueTypeFromPrismaField(
      entityPluralName,
      field,
      {
        ...prismaField,
        isRequired: true,
      },
      optional,

      isEnum,
      isQuery,
      isObjectType,
      isNestedInput,
      dtoType
    );
    return [builders.tsUnionType([type, builders.tsNullKeyword()])];
  }
  if (isToManyRelationField(field) && !isObjectType && !isNestedInput) {
    switch (dtoType) {
      case EntityDtoTypeEnum.CreateInput:
        return [
          builders.tsTypeReference(
            createCreateNestedManyWithoutInputID(
              entityPluralName,
              field.properties.relatedEntity.name
            )
          ),
        ];
      case EntityDtoTypeEnum.UpdateInput:
        return [
          builders.tsTypeReference(
            createUpdateManyWithoutInputID(
              entityPluralName,
              field.properties.relatedEntity.name
            )
          ),
        ];
      case EntityDtoTypeEnum.WhereInput:
        return [
          builders.tsTypeReference(
            createEntityListRelationFilterID(prismaField.type)
          ),
        ];
      default:
        throw new Error("Invalid EntityDtoType");
    }
  }
  if (prismaField.isList) {
    const itemPrismaField = {
      ...prismaField,
      isList: false,
    };
    const [itemType] = createFieldValueTypeFromPrismaField(
      entityPluralName,
      field,
      itemPrismaField,
      optional,
      isEnum,
      isQuery,
      isObjectType,
      isNestedInput,
      dtoType
    );
    return [createGenericArray(itemType), itemType];
  }
  if (prismaField.kind === FieldKind.Scalar) {
    if (isQuery) {
      return [
        builders.tsTypeReference(
          getFilterASTIdentifier(field.required, prismaField.type)
        ),
      ];
    } else {
      if (isObjectType && prismaField.type === ScalarType.Json) {
        return [builders.tsTypeReference(JSON_VALUE_ID)];
      }
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
  if (isQuery || isEntityInputExceptRelationInput(dtoType) || isNestedInput) {
    return [
      builders.tsTypeReference(createWhereUniqueInputID(prismaField.type)),
    ];
  } else {
    return [builders.tsTypeReference(builders.identifier(prismaField.type))];
  }
}

export function getFilterASTIdentifier(
  isRequired: boolean,
  type: ScalarType
): namedTypes.Identifier {
  if (isRequired || type === ScalarType.Json) {
    return PRISMA_SCALAR_TO_QUERY_TYPE[type];
  } else {
    return PRISMA_SCALAR_TO_NULLABLE_QUERY_TYPE[type];
  }
}

export function getTypeName(
  type: TSTypeKind,
  arrayElementType: TSTypeKind,
  isList: boolean
): namedTypes.Identifier {
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
    if (isList) {
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
  return typeName;
}

function isEntityInputExceptRelationInput(dtoType: EntityDtoTypeEnum): boolean {
  if (
    dtoType === EntityDtoTypeEnum.CreateInput ||
    dtoType === EntityDtoTypeEnum.UpdateInput ||
    dtoType === EntityDtoTypeEnum.WhereInput ||
    dtoType === EntityDtoTypeEnum.WhereUniqueInput ||
    dtoType === EntityDtoTypeEnum.ListRelationFilter
  ) {
    return true;
  }
  return false;
}
