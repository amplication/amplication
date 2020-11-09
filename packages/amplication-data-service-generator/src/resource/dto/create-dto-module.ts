import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { camelCase } from "camel-case";
import { Entity } from "../../types";
import { Module, relativeImportPath } from "../../util/module";
import { createEnumName } from "../../prisma/create-prisma-schema";
import {
  addImports,
  importContainedIdentifiers,
  NamedClassDeclaration,
} from "../../util/ast";
import { getEnumFields } from "../../util/entity";
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
import { createWhereUniqueInputID } from "./create-where-unique-input";

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
  entityName: string,
  entities: Entity[]
): Module {
  const modulePath = createDTOModulePath(entityName, dto.id.name);
  return {
    code: print(createDTOFile(dto, modulePath, entities)).code,
    path: modulePath,
  };
}

export function createDTOFile(
  dto: namedTypes.ClassDeclaration | namedTypes.TSEnumDeclaration,
  modulePath: string,
  entities: Entity[]
): namedTypes.File {
  const file = builders.file(
    builders.program([builders.exportNamedDeclaration(dto)])
  );
  const moduleToIds = {
    ...IMPORTABLE_NAMES,
    ...getEntityModuleToDTOIds(modulePath, entities),
  };

  addImports(file, importContainedIdentifiers(dto, moduleToIds));

  return file;
}

export function getEntityModuleToDTOIds(
  modulePath: string,
  entities: Entity[]
): Record<string, namedTypes.Identifier[]> {
  return Object.fromEntries(
    entities
      .flatMap(
        (entity): Array<[namedTypes.Identifier, string]> => {
          const enumIds = getEnumFields(entity).map((field) =>
            builders.identifier(createEnumName(field))
          );
          const dtoIds = [
            builders.identifier(entity.name),
            createWhereUniqueInputID(entity.name),
            ...enumIds,
          ];
          /** @todo use mapping from entity to directory */
          const directory = camelCase(entity.name);
          return dtoIds.map((id) => [
            id,
            createDTOModulePath(directory, id.name),
          ]);
        }
      )
      .filter(([, dtoModulePath]) => dtoModulePath !== modulePath)
      .map(([id, dtoModulePath]) => [
        relativeImportPath(modulePath, dtoModulePath),
        [id],
      ])
  );
}

export function createDTOModulePath(
  entityName: string,
  dtoName: string
): string {
  return `${entityName}/${dtoName}.ts`;
}
