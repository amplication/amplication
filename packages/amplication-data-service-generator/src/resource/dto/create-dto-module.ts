import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { Module, relativeImportPath } from "../../util/module";
import {
  addImports,
  importContainedIdentifiers,
  NamedClassDeclaration,
} from "../../util/ast";
import {
  CLASS_VALIDATOR_MODULE,
  IS_BOOLEAN_ID,
  IS_DATE_ID,
  IS_ENUM_ID,
  IS_INT_ID,
  IS_NUMBER_ID,
  IS_OPTIONAL_ID,
  IS_STRING_ID,
  VALIDATE_NESTED_ID,
} from "./class-validator.util";
import {
  CLASS_TRANSFORMER_MODULE,
  TRANSFORM_ID,
  TYPE_ID,
} from "./class-transformer.util";
import { NESTJS_SWAGGER_MODULE, API_PROPERTY_ID } from "./nestjs-swagger.util";

export const IMPORTABLE_NAMES: Record<string, namedTypes.Identifier[]> = {
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
  [CLASS_TRANSFORMER_MODULE]: [TYPE_ID, TRANSFORM_ID],
  [NESTJS_SWAGGER_MODULE]: [API_PROPERTY_ID],
};

export function createDTOModule(
  dto: NamedClassDeclaration | namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>
): Module {
  return {
    code: print(createDTOFile(dto, dtoNameToPath[dto.id.name], dtoNameToPath))
      .code,
    path: dtoNameToPath[dto.id.name],
  };
}

export function createDTOFile(
  dto: namedTypes.ClassDeclaration | namedTypes.TSEnumDeclaration,
  modulePath: string,
  dtoNameToPath: Record<string, string>
): namedTypes.File {
  const file = builders.file(
    builders.program([builders.exportNamedDeclaration(dto)])
  );
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
  entityName: string,
  dtoName: string
): string {
  return `${entityName}/${dtoName}.ts`;
}
