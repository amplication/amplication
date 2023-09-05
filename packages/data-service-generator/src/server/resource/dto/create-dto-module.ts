import { print } from "@amplication/code-gen-utils";
import { namedTypes, builders } from "ast-types";
import { DeclarationKind } from "ast-types/gen/kinds";
import { NamedClassDeclaration, Module } from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../utils/module";
import {
  addAutoGenerationComment,
  addImports,
  importContainedIdentifiers,
  exportNames,
} from "../../../utils/ast";
import {
  CLASS_VALIDATOR_MODULE,
  IS_BOOLEAN_ID,
  IS_DATE_ID,
  IS_ENUM_ID,
  IS_INT_ID,
  IS_NUMBER_ID,
  IS_OPTIONAL_ID,
  IS_STRING_ID,
  IS_JSON_VALUE_ID,
  VALIDATE_NESTED_ID,
  CLASS_VALIDATOR_CUSTOM_VALIDATORS_MODULE,
} from "./class-validator.util";
import {
  CLASS_TRANSFORMER_MODULE,
  TRANSFORM_ID,
  TYPE_ID,
} from "./class-transformer.util";
import { NESTJS_SWAGGER_MODULE, API_PROPERTY_ID } from "./nestjs-swagger.util";
import {
  NESTJS_GRAPHQL_MODULE,
  OBJECT_TYPE_ID,
  INPUT_TYPE_ID,
  ARGS_TYPE_ID,
  FIELD_ID,
  FLOAT_ID,
} from "./nestjs-graphql.util";
import {
  GRAPHQL_TYPE_JSON_MODULE,
  GRAPHQL_JSON_ID,
} from "./graphql-type-json.util";
import { TYPE_FEST_MODULE, JSON_VALUE_ID } from "./type-fest.util";
import {
  EnumScalarFiltersTypes,
  SCALAR_FILTER_TO_MODULE_AND_TYPE,
} from "./filters.util";
import { SORT_ORDER_ID, SORT_ORDER_MODULE } from "./sort-order.util";
import { GRAPHQL_BIGINT_VALUE, INPUT_JSON_VALUE_KEY } from "./constants";
import DsgContext from "../../../dsg-context";
import { logger } from "../../../logging";
import { DECIMAL_JS_MODULE, DECIMAL_VALUE_ID } from "./decimal-js";

const FILTERS_IMPORTABLE_NAMES = Object.fromEntries(
  Object.values(EnumScalarFiltersTypes).map((filter) => {
    return [
      SCALAR_FILTER_TO_MODULE_AND_TYPE[filter].module,
      [SCALAR_FILTER_TO_MODULE_AND_TYPE[filter].type],
    ];
  })
);

export function getImportableNames() {
  const { hasDecimalFields, hasBigIntFields } = DsgContext.getInstance;

  const importableNames: Record<string, namedTypes.Identifier[]> = {
    [CLASS_VALIDATOR_MODULE]: [
      IS_BOOLEAN_ID,
      IS_DATE_ID,
      IS_NUMBER_ID,
      IS_INT_ID,
      IS_STRING_ID,
      IS_OPTIONAL_ID,
      IS_ENUM_ID,
      VALIDATE_NESTED_ID,
    ],
    [CLASS_VALIDATOR_CUSTOM_VALIDATORS_MODULE]: [IS_JSON_VALUE_ID],
    [CLASS_TRANSFORMER_MODULE]: [TYPE_ID, TRANSFORM_ID],
    [NESTJS_SWAGGER_MODULE]: [API_PROPERTY_ID],
    [TYPE_FEST_MODULE]: [JSON_VALUE_ID],
    [GRAPHQL_TYPE_JSON_MODULE]: [GRAPHQL_JSON_ID],
    [NESTJS_GRAPHQL_MODULE]: [
      OBJECT_TYPE_ID,
      INPUT_TYPE_ID,
      ARGS_TYPE_ID,
      FIELD_ID,
      FLOAT_ID,
    ],
    [SORT_ORDER_MODULE]: [SORT_ORDER_ID],
    "../../types": [builders.identifier(INPUT_JSON_VALUE_KEY)],
    ...FILTERS_IMPORTABLE_NAMES,
  };

  if (hasDecimalFields) {
    importableNames[DECIMAL_JS_MODULE] = [DECIMAL_VALUE_ID];
  }
  if (hasBigIntFields) {
    importableNames["../../util/GraphQLBigInt"] = [
      builders.identifier(GRAPHQL_BIGINT_VALUE),
    ];
  }

  return importableNames;
}

export function createDTOModule(
  dto: NamedClassDeclaration | namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>
): Module {
  try {
    const file = createDTOFile(dto, dtoNameToPath[dto.id.name], dtoNameToPath);
    addAutoGenerationComment(file);
    return {
      code: print(file).code,
      path: dtoNameToPath[dto.id.name],
    };
  } catch (error) {
    logger.info(error);
    throw error;
  }
}

export function createDTOFile(
  dto: DeclarationKind,
  modulePath: string,
  dtoNameToPath: Record<string, string>
): namedTypes.File {
  const statements =
    namedTypes.ClassDeclaration.check(dto) &&
    namedTypes.Identifier.check(dto.id)
      ? [dto, exportNames([dto.id])]
      : [builders.exportNamedDeclaration(dto)];
  const file = builders.file(builders.program(statements));
  const moduleToIds = {
    ...getImportableNames(),
    ...getImportableDTOs(modulePath, dtoNameToPath),
  };

  addImports(file, importContainedIdentifiers(dto, moduleToIds));

  return file;
}

export function getImportableDTOs(
  modulePath: string,
  dtoNameToPath: Record<string, string>
): Record<string, namedTypes.Identifier[]> {
  return Object.fromEntries(
    Object.entries(dtoNameToPath)
      .filter(([, path]) => path !== modulePath)
      .map(([dtoName, path]) => {
        return [
          relativeImportPath(modulePath, path),
          [builders.identifier(dtoName)],
        ];
      })
  );
}

export function createDTOModulePath(
  entityDirectory: string,
  dtoName: string
): string {
  const { serverDirectories } = DsgContext.getInstance;
  return `${serverDirectories.srcDirectory}/${entityDirectory}/base/${dtoName}.ts`;
}
