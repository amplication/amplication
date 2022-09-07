import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { DeclarationKind } from "ast-types/gen/kinds";
import { NamedClassDeclaration, Module } from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../util/module";
import {
  addAutoGenerationComment,
  addImports,
  importContainedIdentifiers,
  exportNames,
} from "../../../util/ast";
import {
  CLASS_VALIDATOR_MODULE,
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
} from "./nestjs-graphql.util";
import {
  GRAPHQL_TYPE_JSON_MODULE,
  GRAPHQL_JSON_OBJECT_ID,
} from "./graphql-type-json.util";
import { TYPE_FEST_MODULE, JSON_VALUE_ID } from "./type-fest.util";
import {
  EnumScalarFiltersTypes,
  SCALAR_FILTER_TO_MODULE_AND_TYPE,
} from "./filters.util";
import { SORT_ORDER_ID, SORT_ORDER_MODULE } from "./sort-order.util";
import { INPUT_JSON_VALUE_KEY } from "./constants";

const FILTERS_IMPORTABLE_NAMES = Object.fromEntries(
  Object.values(EnumScalarFiltersTypes).map((filter) => {
    return [
      SCALAR_FILTER_TO_MODULE_AND_TYPE[filter].module,
      [SCALAR_FILTER_TO_MODULE_AND_TYPE[filter].type],
    ];
  })
);

export const IMPORTABLE_NAMES: Record<string, namedTypes.Identifier[]> = {
  [CLASS_VALIDATOR_MODULE]: [
    IS_BOOLEAN_ID,
    IS_DATE_ID,
    IS_NUMBER_ID,
    IS_INT_ID,
    IS_STRING_ID,
    IS_JSON_ID,
    IS_OPTIONAL_ID,
    IS_ENUM_ID,
    VALIDATE_NESTED_ID,
  ],
  [CLASS_TRANSFORMER_MODULE]: [TYPE_ID, TRANSFORM_ID],
  [NESTJS_SWAGGER_MODULE]: [API_PROPERTY_ID],
  [TYPE_FEST_MODULE]: [JSON_VALUE_ID],
  [GRAPHQL_TYPE_JSON_MODULE]: [GRAPHQL_JSON_OBJECT_ID],
  [NESTJS_GRAPHQL_MODULE]: [
    OBJECT_TYPE_ID,
    INPUT_TYPE_ID,
    ARGS_TYPE_ID,
    FIELD_ID,
  ],
  [SORT_ORDER_MODULE]: [SORT_ORDER_ID],
  "../../types": [builders.identifier(INPUT_JSON_VALUE_KEY)],
  ...FILTERS_IMPORTABLE_NAMES,
};

export function createDTOModule(
  dto: NamedClassDeclaration | namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>
): Module {
  const file = createDTOFile(dto, dtoNameToPath[dto.id.name], dtoNameToPath);
  addAutoGenerationComment(file);
  return {
    code: print(file).code,
    path: dtoNameToPath[dto.id.name],
  };
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
    ...IMPORTABLE_NAMES,
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
  dtoName: string,
  srcDirectory: string
): string {
  return `${srcDirectory}/${entityDirectory}/base/${dtoName}.ts`;
}
