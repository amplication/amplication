import { builders, namedTypes } from "ast-types";
import { EntityField, EnumDataType } from "../../types";
import {
  createDefaultValue,
  createUserObjectCustomProperties,
  DEFAULT_ADDRESS_LITERAL,
  DEFAULT_BOOLEAN_LITERAL,
  DEFAULT_EMAIL_LITERAL,
  DEFAULT_EMPTY_STRING_LITERAL,
  DEFAULT_NUMBER_LITERAL,
  EMPTY_ARRAY_EXPRESSION,
  NEW_DATE_EXPRESSION,
} from "./create-seed";
import { DEFAULT_USER_ENTITY } from "../user-entity";
import { createEnumMemberName } from "../resource/dto/create-enum-dto";
import { createEnumName } from "../prisma/create-prisma-schema";
import { memberExpression } from "../../util/ast";

const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityField";
const EXAMPLE_ENTITY_FIELD_DISPLAY_NAME = "Example Entity Field";
const EXAMPLE_SINGLE_LINE_TEXT_FIELD = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
  required: true,
  searchable: false,
  dataType: EnumDataType.SingleLineText,
};
const EXAMPLE_OPTION_SET_OPTION = {
  value: "EXAMPLE_OPTION_VALUE",
  label: "EXAMPLE_LABEL",
};
const EXAMPLE_OPTION_SET_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
  required: true,
  searchable: false,
  dataType: EnumDataType.OptionSet,
  properties: {
    options: [EXAMPLE_OPTION_SET_OPTION],
  },
};

describe("createUserObjectCustomProperties", () => {
  test("creates custom object properties", () => {
    const userEntity = {
      ...DEFAULT_USER_ENTITY,
      fields: [...DEFAULT_USER_ENTITY.fields, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
    };
    expect(createUserObjectCustomProperties(userEntity)).toEqual([
      builders.objectProperty(
        builders.identifier(EXAMPLE_ENTITY_FIELD_NAME),
        // @ts-ignore
        createDefaultValue(EXAMPLE_SINGLE_LINE_TEXT_FIELD)
      ),
    ]);
  });
});

describe("createDefaultValue", () => {
  const cases: Array<[string, EntityField, namedTypes.Expression | null]> = [
    [
      "SingleLineText",
      EXAMPLE_SINGLE_LINE_TEXT_FIELD,
      DEFAULT_EMPTY_STRING_LITERAL,
    ],
    [
      "MultiLineText",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.MultiLineText,
      },
      DEFAULT_EMPTY_STRING_LITERAL,
    ],
    [
      "Email",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Email,
      },
      DEFAULT_EMAIL_LITERAL,
    ],
    [
      "WholeNumber",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.WholeNumber,
      },
      DEFAULT_NUMBER_LITERAL,
    ],
    [
      "DateTime",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.DateTime,
      },
      NEW_DATE_EXPRESSION,
    ],
    [
      "DecimalNumber",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.DecimalNumber,
      },
      DEFAULT_NUMBER_LITERAL,
    ],
    [
      "MultiSelectOptionSet",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.MultiSelectOptionSet,
        properties: {
          options: [
            {
              value: "EXAMPLE_VALUE",
              label: "EXAMPLE_LABEL",
            },
          ],
        },
      },
      EMPTY_ARRAY_EXPRESSION,
    ],
    [
      "OptionSet",
      EXAMPLE_OPTION_SET_FIELD,
      memberExpression`${createEnumName(
        EXAMPLE_OPTION_SET_FIELD
      )}.${createEnumMemberName(EXAMPLE_OPTION_SET_OPTION.label)}`,
    ],
    [
      "Boolean",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Boolean,
      },
      DEFAULT_BOOLEAN_LITERAL,
    ],
    [
      "GeographicLocation",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.GeographicLocation,
      },
      DEFAULT_ADDRESS_LITERAL,
    ],
    [
      "Id",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Id,
      },
      null,
    ],
    [
      "CreatedAt",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.CreatedAt,
      },
      null,
    ],
    [
      "UpdatedAt",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.UpdatedAt,
      },
      null,
    ],
    [
      "Roles",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Roles,
      },
      null,
    ],
    [
      "Username",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Username,
      },
      null,
    ],
    [
      "Password",
      {
        name: EXAMPLE_ENTITY_FIELD_NAME,
        displayName: EXAMPLE_ENTITY_FIELD_DISPLAY_NAME,
        required: true,
        searchable: false,
        dataType: EnumDataType.Password,
      },
      null,
    ],
  ];
  test.each(cases)("%s", (name, field, expected) => {
    expect(createDefaultValue(field)).toEqual(expected);
  });
});
