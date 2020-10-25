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
import { classProperty } from "../../util/ast";
import { EntityField, EnumDataType, EnumPrivateDataType } from "../../types";
import {
  IS_STRING_ID,
  VALIDATE_NESTED_ID,
  IS_OPTIONAL_ID,
} from "./class-validator.util";
import { TYPE_ID } from "./class-transformer.util";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import {
  createFieldClassProperty,
  createFieldValueTypeFromPrismaField,
} from "./create-field-class-property";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_OTHER_ENTITY_ID = "EXAMPLE_OTHER_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleOtherEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};
const EXAMPLE_OPTIONAL_ENTITY_FIELD: EntityField = {
  name: "exampleOptionalEntityField",
  displayName: "Example Optional Entity Field",
  description: "Example optional entity field description",
  dataType: EnumDataType.Id,
  required: false,
  searchable: false,
};
const EXAMPLE_LIST_ENTITY_FIELD: EntityField = {
  name: "exampleListEntityField",
  displayName: "Example List Entity Field",
  description: "Example list entity field description",
  dataType: EnumPrivateDataType.Roles,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY_LOOKUP_FIELD: EntityField = {
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: false,
  properties: {
    relatedEntityId: EXAMPLE_OTHER_ENTITY_ID,
  },
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
    Record<string, string>,
    namedTypes.ClassProperty
  ]> = [
    [
      "id field (not input)",
      EXAMPLE_ENTITY_FIELD,
      !EXAMPLE_ENTITY_FIELD.required,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ENTITY_FIELD.name),
        builders.tsTypeAnnotation(builders.tsStringKeyword()),
        true,
        false,
        null,
        [builders.decorator(builders.callExpression(IS_STRING_ID, []))]
      ),
    ],
    [
      "optional id field (not input)",
      EXAMPLE_OPTIONAL_ENTITY_FIELD,
      !EXAMPLE_OPTIONAL_ENTITY_FIELD.required,
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
          builders.decorator(builders.callExpression(IS_STRING_ID, [])),
          builders.decorator(builders.callExpression(IS_OPTIONAL_ID, [])),
        ]
      ),
    ],
    [
      "lookup field (not input)",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      !EXAMPLE_ENTITY_LOOKUP_FIELD.required,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ENTITY_LOOKUP_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsTypeReference(
            builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)
          )
        ),
        true,
        false,
        null,
        [
          builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
          builders.decorator(
            builders.callExpression(TYPE_ID, [
              builders.arrowFunctionExpression(
                [],
                builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)
              ),
            ])
          ),
        ]
      ),
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, optional, entityIdToName, isInput, expected) => {
      expect(
        print(
          createFieldClassProperty(field, optional, entityIdToName, isInput)
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
      EXAMPLE_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_ENTITY_FIELD.name,
        ScalarType.String,
        false,
        true
      ),
      false,
      false,
      builders.tsStringKeyword(),
    ],
    [
      "lookup type, not isInput",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        true
      ),
      false,
      false,
      builders.tsTypeReference(builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)),
    ],
    [
      "lookup type, isInput",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_LOOKUP_FIELD.name,
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
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        false
      ),
      true,
      false,
      builders.tsTypeReference(
        createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY_NAME)
      ),
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
      builders.tsArrayType(builders.tsStringKeyword()),
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
