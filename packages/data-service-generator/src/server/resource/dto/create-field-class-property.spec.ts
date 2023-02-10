import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { ObjectField, ScalarField, ScalarType } from "prisma-schema-dsl-types";
import { createObjectField, createScalarField } from "prisma-schema-dsl";
import { print } from "@amplication/code-gen-utils";
import { Entity, EntityField, EnumDataType } from "@amplication/code-gen-types";
import { classProperty, createGenericArray } from "../../../utils/ast";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_LOOKUP_FIELD,
  EXAMPLE_OTHER_ENTITY,
} from "../util/test-data";
import * as classTransformerUtil from "./class-transformer.util";
import {
  IS_OPTIONAL_ID,
  IS_STRING_ID,
  VALIDATE_NESTED_ID,
} from "./class-validator.util";
import {
  createFieldClassProperty,
  createFieldValueTypeFromPrismaField,
  NULLABLE_ID,
  REQUIRED_ID,
  STRING_ID,
  TRUE_LITERAL,
  TYPE_ID,
} from "./create-field-class-property";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { FIELD_ID } from "./nestjs-graphql.util";
import { API_PROPERTY_ID } from "./nestjs-swagger.util";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};

const EXAMPLE_OPTIONAL_ENTITY_FIELD: EntityField = {
  id: "EXAMPLE_OPTIONAL_ENTITY_FIELD_ID",
  permanentId: "EXAMPLE_OPTIONAL_ENTITY_PERMANENT_FIELD_ID",
  name: "exampleOptionalEntityField",
  displayName: "Example Optional Entity Field",
  description: "Example optional entity field description",
  dataType: EnumDataType.Id,
  required: false,
  unique: false,
  searchable: false,
};
const EXAMPLE_LIST_ENTITY_FIELD: EntityField = {
  id: "EXAMPLE_LIST_ENTITY_FIELD_ID",
  permanentId: "EXAMPLE_LIST_PERMANENT_FIELD_ID",
  name: "exampleListEntityField",
  displayName: "Example List Entity Field",
  description: "Example list entity field description",
  dataType: EnumDataType.Roles,
  required: true,
  unique: false,
  searchable: false,
};

describe("createFieldClassProperty", () => {
  const cases: Array<
    [
      string,
      EntityField,
      boolean,
      boolean,
      boolean,
      EntityDtoTypeEnum,
      namedTypes.ClassProperty
    ]
  > = [
    [
      "id field (not input)",
      EXAMPLE_ID_FIELD,
      !EXAMPLE_ID_FIELD.required,
      false,
      false,
      EntityDtoTypeEnum.Entity,
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
      EntityDtoTypeEnum.Entity,
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
      EntityDtoTypeEnum.Entity,
      classProperty(
        builders.identifier(EXAMPLE_LOOKUP_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsTypeReference(
            builders.identifier(EXAMPLE_OTHER_ENTITY.name)
          )
        ),
        false,
        true,
        null,
        [
          builders.decorator(
            builders.callExpression(API_PROPERTY_ID, [
              builders.objectExpression([
                builders.objectProperty(REQUIRED_ID, TRUE_LITERAL),
                builders.objectProperty(
                  TYPE_ID,
                  builders.arrowFunctionExpression(
                    [],
                    builders.identifier(EXAMPLE_OTHER_ENTITY.name)
                  )
                ),
              ]),
            ])
          ),
          builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
          builders.decorator(
            builders.callExpression(classTransformerUtil.TYPE_ID, [
              builders.arrowFunctionExpression(
                [],
                builders.identifier(EXAMPLE_OTHER_ENTITY.name)
              ),
            ])
          ),
        ]
      ),
    ],
  ];
  test.each(cases)(
    "%s",
    (
      name,
      field,
      optional,
      isQuery,
      isObjectType,
      entityDtoTypeEnum,
      expected
    ) => {
      expect(
        print(
          createFieldClassProperty(
            field,
            EXAMPLE_ENTITY,
            optional,
            isQuery,
            isObjectType,
            entityDtoTypeEnum
          )
        ).code
      ).toEqual(print(expected).code);
    }
  );
});

describe("createFieldValueTypeFromPrismaField", () => {
  const cases: Array<
    [
      string,
      EntityField,
      ScalarField | ObjectField,
      EntityDtoTypeEnum,
      boolean,
      boolean,
      TSTypeKind[]
    ]
  > = [
    [
      "scalar type",
      EXAMPLE_ID_FIELD,
      createScalarField(EXAMPLE_ID_FIELD.name, ScalarType.String, false, true),
      EntityDtoTypeEnum.Entity,
      false,
      false,
      [builders.tsStringKeyword()],
    ],
    [
      "lookup type, not isInput",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY.name,
        false,
        true
      ),
      EntityDtoTypeEnum.Entity,
      false,
      false,
      [
        builders.tsTypeReference(
          builders.identifier(EXAMPLE_OTHER_ENTITY.name)
        ),
      ],
    ],
    [
      "lookup type, isInput",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY.name,
        false,
        true
      ),
      EntityDtoTypeEnum.CreateInput,
      false,
      false,
      [
        builders.tsTypeReference(
          createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY.name)
        ),
      ],
    ],
    [
      "lookup type, isInput, optional",
      EXAMPLE_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY.name,
        false,
        false
      ),
      EntityDtoTypeEnum.CreateInput,
      false,
      false,
      [
        builders.tsUnionType([
          builders.tsTypeReference(
            createWhereUniqueInputID(EXAMPLE_OTHER_ENTITY.name)
          ),
          builders.tsNullKeyword(),
        ]),
      ],
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
      EntityDtoTypeEnum.Entity,
      false,
      false,
      [
        builders.tsUnionType([
          builders.tsStringKeyword(),
          builders.tsNullKeyword(),
        ]),
      ],
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
      EntityDtoTypeEnum.Entity,
      false,
      false,
      [
        createGenericArray(builders.tsStringKeyword()),
        builders.tsStringKeyword(),
      ],
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, prismaField, inputType, isEnum, isNestedInput, expected) => {
      expect(
        createFieldValueTypeFromPrismaField(
          "Names",
          field,
          prismaField,
          field.required,
          isEnum,
          false,
          false,
          isNestedInput,
          inputType
        )
      ).toEqual(expected);
    }
  );
});
