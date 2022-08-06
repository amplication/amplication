import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import {
  Entity,
  EntityField,
  EnumDataType,
  Module,
  types,
  DTOs,
} from "@amplication/code-gen-types";
import { readFile } from "../../util/module";
import {
  addImports,
  awaitExpression,
  importContainedIdentifiers,
  interpolate,
  memberExpression,
  removeTSVariableDeclares,
} from "../../util/ast";
import {
  USER_AUTH_FIELDS,
  USER_NAME_FIELD,
  USER_PASSWORD_FIELD,
  USER_ROLES_FIELD,
} from "../user-entity";
import { getDTONameToPath } from "../resource/create-dtos";
import { getImportableDTOs } from "../resource/dto/create-dto-module";
import { createEnumMemberName } from "../resource/dto/create-enum-dto";
import { createEnumName } from "../prisma/create-prisma-schema";

const seedTemplatePath = require.resolve("./seed.template.ts");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const ADMIN_ROLE = "user";
const DEFAULT_ADDRESS = "(32.085300, 34.781769)";
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
    awaitExpression`await hash("${ADMIN_PASSWORD}", bcryptSalt)`
  ),
  builders.objectProperty(
    builders.identifier(USER_ROLES_FIELD.name),
    builders.arrayExpression([builders.stringLiteral(ADMIN_ROLE)])
  ),
];

export async function createSeedModule(
  userEntity: Entity,
  dtos: DTOs,
  scriptsDirectory: string,
  srcDirectory: string
): Promise<Module> {
  const MODULE_PATH = `${scriptsDirectory}/seed.ts`;
  const file = await readFile(seedTemplatePath);
  const customProperties = createUserObjectCustomProperties(userEntity);

  interpolate(file, {
    DATA: builders.objectExpression([
      ...DEFAULT_AUTH_PROPERTIES,
      ...customProperties,
    ]),
  });

  removeTSVariableDeclares(file);

  const dtoNameToPath = getDTONameToPath(dtos, srcDirectory);
  const dtoImports = importContainedIdentifiers(
    file,
    getImportableDTOs(MODULE_PATH, dtoNameToPath)
  );

  addImports(file, dtoImports);

  return {
    path: MODULE_PATH,
    code: print(file).code,
  };
}

export function createUserObjectCustomProperties(
  userEntity: Entity
): namedTypes.ObjectProperty[] {
  return userEntity.fields
    .filter((field) => field.required)
    .map((field): [EntityField, namedTypes.Expression | null] => [
      field,
      createDefaultValue(field, userEntity),
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
  field: EntityField,
  entity: Entity
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
      const { options } = field.properties as types.OptionSet;
      const [firstOption] = options;
      return memberExpression`${createEnumName(
        field,
        entity
      )}.${createEnumMemberName(firstOption.label)}`;
    }
    case EnumDataType.Boolean: {
      return DEFAULT_BOOLEAN_LITERAL;
    }
    case EnumDataType.GeographicLocation: {
      return DEFAULT_ADDRESS_LITERAL;
    }
    case EnumDataType.Json: {
      return DEFAULT_BOOLEAN_LITERAL;
    }
    case EnumDataType.Id:
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
    case EnumDataType.Roles:
    case EnumDataType.Password:
    case EnumDataType.Username: {
      return null;
    }
    case EnumDataType.Lookup: {
      throw new Error(
        "Cannot create seed user value for a field with Lookup data type"
      );
    }
    default: {
      throw new Error(`Unexpected data type: ${field.dataType}`);
    }
  }
}
