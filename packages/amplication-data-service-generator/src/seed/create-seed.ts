import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import {
  Entity,
  EntityField,
  EnumDataType,
  EnumPrivateDataType,
} from "../types";
import { Module, readFile } from "../util/module";
import { interpolate, removeTSVariableDeclares } from "../util/ast";
import {
  USER_AUTH_FIELDS,
  USER_NAME_FIELD,
  USER_PASSWORD_FIELD,
  USER_ROLES_FIELD,
} from "../user-entity";

const seedTemplatePath = require.resolve("./seed.template.ts");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const ADMIN_ROLE = "user";
const DEFAULT_ADDRESS = "Yosef Yekuti'eli 4, Tel Aviv-Yafo, Israel";
const DEFAULT_EMAIL = "example@example.com";
const DATE_ID = builders.identifier("Date");
export const DEFAULT_EMPTY_STRING_LITERAL = builders.stringLiteral("");
export const DEFAULT_ADDRESS_LITERAL = builders.stringLiteral(DEFAULT_ADDRESS);
export const DEFAULT_BOOLEAN_LITERAL = builders.booleanLiteral(false);
export const EMPTY_ARRAY_EXPRESSION = builders.arrayExpression([]);
export const DEFAULT_NUMBER_LITERAL = builders.numericLiteral(0);
export const DEFAULT_EMAIL_LITERAL = builders.stringLiteral(DEFAULT_EMAIL);
export const NEW_DATE_EXPRESSION = builders.newExpression(DATE_ID, []);
export const AUTH_FIELD_NAMES = new Set(
  USER_AUTH_FIELDS.map((field) => field.name)
);
export const DEFAULT_AUTH_PROPERTIES = [
  builders.objectProperty(
    builders.identifier(USER_NAME_FIELD.name),
    builders.stringLiteral(ADMIN_USERNAME)
  ),
  builders.objectProperty(
    builders.identifier(USER_PASSWORD_FIELD.name),
    builders.stringLiteral(ADMIN_PASSWORD)
  ),
  builders.objectProperty(
    builders.identifier(USER_ROLES_FIELD.name),
    builders.arrayExpression([builders.stringLiteral(ADMIN_ROLE)])
  ),
];

export async function createSeedModule(userEntity: Entity): Promise<Module> {
  const file = await readFile(seedTemplatePath);
  const customProperties = createUserObjectCustomProperties(userEntity);
  interpolate(file, {
    DATA: builders.objectExpression([
      ...DEFAULT_AUTH_PROPERTIES,
      ...customProperties,
    ]),
  });
  removeTSVariableDeclares(file);
  return {
    path: "prisma/seed.ts",
    code: print(file).code,
  };
}

export function createUserObjectCustomProperties(
  userEntity: Entity
): namedTypes.ObjectProperty[] {
  return userEntity.fields
    .map((field): [EntityField, namedTypes.Expression | null] => [
      field,
      createDefaultValue(field),
    ])
    .filter(([field, value]) => !AUTH_FIELD_NAMES.has(field.name) && value)
    .map(([field, value]) =>
      builders.objectProperty(
        builders.identifier(field.name),
        // @ts-ignore
        value
      )
    );
}

export function createDefaultValue(
  field: EntityField
): namedTypes.Expression | null {
  switch (field.dataType) {
    case EnumDataType.SingleLineText:
    case EnumDataType.MultiLineText: {
      return DEFAULT_EMPTY_STRING_LITERAL;
    }
    case EnumDataType.Email: {
      return DEFAULT_EMAIL_LITERAL;
    }
    case EnumDataType.WholeNumber: {
      return DEFAULT_NUMBER_LITERAL;
    }
    case EnumDataType.DateTime: {
      return NEW_DATE_EXPRESSION;
    }
    case EnumDataType.DecimalNumber: {
      return DEFAULT_NUMBER_LITERAL;
    }
    case EnumDataType.MultiSelectOptionSet: {
      return EMPTY_ARRAY_EXPRESSION;
    }
    case EnumDataType.OptionSet: {
      /** @todo */
      return null;
    }
    case EnumDataType.Boolean: {
      return DEFAULT_BOOLEAN_LITERAL;
    }
    case EnumDataType.GeographicAddress: {
      return DEFAULT_ADDRESS_LITERAL;
    }
    case EnumDataType.Id:
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
    case EnumPrivateDataType.Roles:
    case EnumPrivateDataType.Username: {
      return null;
    }
    default: {
      throw new Error(`Unexpected data type: ${field.dataType}`);
    }
  }
}
