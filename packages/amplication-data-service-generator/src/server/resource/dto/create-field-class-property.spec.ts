import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { print } from "recast";
import {
  ObjectField,
  ScalarField,
  createScalarField,
  createObjectField,
  ScalarType,
} from "prisma-schema-dsl";
import { classProperty, createGenericArray } from "../../../util/ast";
import { EntityField, EnumDataType } from "../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_LOOKUP_FIELD,
  EXAMPLE_OTHER_ENTITY_ID,
} from "../util/test-data";
import {
  IS_STRING_ID,
  VALIDATE_NESTED_ID,
  IS_OPTIONAL_ID,
} from "./class-validator.util";
import * as classTransformerUtil from "./class-transformer.util";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import {
  createFieldClassProperty,
  createFieldValueTypeFromPrismaField,
  NULLABLE_ID,
  REQUIRED_ID,
  STRING_ID,
  TRUE_LITERAL,
  TYPE_ID,
} from "./create-field-class-property";
import { API_PROPERTY_ID } from "./nestjs-swagger.util";
import { FIELD_ID } from "./nestjs-graphql.util";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleOtherEntityName";
const EXAMPLE_OPTIONAL_ENTITY_FIELD: EntityField = {
  id: "EXAMPLE_OPTIONAL_ENTITY_FIELD_ID",
  name: "exampleOptionalEntityField",
  displayName: "Example Optional Entity Field",
  description: "Example optional entity field description",
  dataType: EnumDataType.Id,
  required: false,
  searchable: false,
};
const EXAMPLE_LIST_ENTITY_FIELD: EntityField = {
  id: "EXAMPLE_LIST_ENTITY_FIELD_ID",
  name: "exampleListEntityField",
  displayName: "Example List Entity Field",
  description: "Example list entity field description",
  dataType: EnumDataType.Roles,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
  [EXAMPLE_OTHER_ENTITY_ID]: EXAMPLE_OTHER_ENTITY_NAME,
};

describe("createFieldClassProperty", () => {
  const cases: Array<[
    string,
    EntityField,
    boolean,
    boolean,
    boolean,
    Record<string, string>,
    namedTypes.ClassProperty
  ]> = [
    [
      "id field (not input)",
      EXAMPLE_ID_FIELD,
      !EXAMPLE_ID_FIELD.required,
      false,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ID_FIELD.name),
        builders.tsTypeAnnotation(builders.tsStringKeyword()),
        true,
        false,
        null,
        [
          builders.decorator(
            builders.callExpression(API_PROPERTY_ID, [
              builders.objectExpression([
                builders.objectProperty(REQUIRED_ID, TRUE_LITERAL),
                builders.objectProperty(TYPE_ID, STRING_ID),
              ]),
            ])
          ),
          builders.decorator(builders.callExpression(IS_STRING_ID, [])),
          builders.decorator(
            builders.callExpression(FIELD_ID, [
              builders.arrowFunctionExpression([], STRING_ID),
            ])
          ),
        ]
      ),
    ],
    [
      "optional id field (not input)",
      EXAMPLE_OPTIONAL_ENTITY_FIELD,
      !EXAMPLE_OPTIONAL_ENTITY_FIELD.required,
      false,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_OPTIONAL_ENTITY_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsUnionType([
            builders.tsStringKeyword(),
            builders.tsNullKeyword(),
          ])
        ),
        true,
        false,
        null,
        [
          builders.decorator(
            builders.callExpression(API_PROPERTY_ID, [
              builders.objectExpression([
                builders.objectProperty(
                  REQUIRED_ID,
                  builders.booleanLiteral(false)
                ),
                builders.objectProperty(TYPE_ID, STRING_ID),
              ]),
            ])
          ),
          builders.decorator(builders.callExpression(IS_STRING_ID, [])),
          builders.decorator(builders.callExpression(IS_OPTIONAL_ID, [])),
          builders.decorator(
            builders.callExpression(FIELD_ID, [
              builders.arrowFunctionExpression([], STRING_ID),
              builders.objectExpression([
                builders.objectProperty(NULLABLE_ID, TRUE_LITERAL),
              ]),
            ])
          ),
        ]
      ),
    ],
    [
      "lookup field (not input)",
      EXAMPLE_LOOKUP_FIELD,
      !EXAMPLE_LOOKUP_FIELD.required,
      false,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_LOOKUP_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsTypeReference(
            createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
          )
        ),
        true,
        false,
        null,
        [
          builders.decorator(
            builders.callExpression(API_PROPERTY_ID, [
              builders.objectExpression([
                builders.objectProperty(REQUIRED_ID, TRUE_LITERAL),
                builders.objectProperty(
                  TYPE_ID,
                  createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
                ),
              ]),
            ])
          ),
          builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
          builders.decorator(
            builders.callExpression(classTransformerUtil.TYPE_ID, [
              builders.arrowFunctionExpression(
                [],
                createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
              ),
            ])
          ),
        ]
      ),
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, optional, isInput, isQuery, entityIdToName, expected) => {
      expect(
        print(
          createFieldClassProperty(
            field,
            optional,
            isInput,
            isQuery,
            entityIdToName
          )
        ).code
      ).toEqual(print(expected).code);
    }
  );
});

describe("createFieldValueTypeFromPrismaField", () => {
  const cases: Array<[
    string,
    EntityField,
    ScalarField | ObjectField,
    boolean,
    boolean,
    TSTypeKind
  ]> = [
    [
      "scalar type",
      EXAMPLE_ID_FIELD,
      createScalarField(EXAMPLE_ID_FIELD.name, ScalarType.String, false, true),
      false,
      false,
      builders.tsStringKeyword(),
    ],
    [
      "lookup type, not isInput",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        true
      ),
      false,
      false,
      builders.tsTypeReference(
        createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
      ),
    ],
    [
      "lookup type, isInput",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        true
      ),
      true,
      false,
      builders.tsTypeReference(
        createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
      ),
    ],
    [
      "lookup type, isInput, optional",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        false
      ),
      true,
      false,
      builders.tsUnionType([
        builders.tsTypeReference(
          createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
        ),
        builders.tsNullKeyword(),
      ]),
    ],
    [
      "optional scalar type",
      EXAMPLE_OPTIONAL_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_OPTIONAL_ENTITY_FIELD.name,
        ScalarType.String,
        false,
        false
      ),
      false,
      false,
      builders.tsUnionType([
        builders.tsStringKeyword(),
        builders.tsNullKeyword(),
      ]),
    ],
    [
      "scalar list type",
      EXAMPLE_LIST_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_LIST_ENTITY_FIELD.name,
        ScalarType.String,
        true,
        true
      ),
      false,
      false,
      createGenericArray(builders.tsStringKeyword()),
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, prismaField, isInput, isEnum, expected) => {
      expect(
        createFieldValueTypeFromPrismaField(field, prismaField, isInput, isEnum)
      ).toEqual(expected);
    }
  );
});
