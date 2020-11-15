import { camelCase } from "camel-case";
import { namedTypes } from "ast-types";
import { Entity } from "../types";
import { NamedClassDeclaration } from "../util/ast";
import { Module } from "../util/module";
import { getEnumFields } from "../util/entity";
import { createEnumName } from "../prisma/create-prisma-schema";
import { createCreateInput } from "./dto/create-create-input";
import { createEntityDTO } from "./dto/create-entity-dto";
import { createEnumDTO } from "./dto/create-enum-dto";
import { createUpdateInput } from "./dto/create-update-input";
import { createWhereInput } from "./dto/create-where-input";
import { createWhereUniqueInput } from "./dto/create-where-unique-input";
import { createDTOModule, createDTOModulePath } from "./dto/create-dto-module";

export type DTOs = {
  [entity: string]: {
    [dto: string]: NamedClassDeclaration | namedTypes.TSEnumDeclaration;
    entity: NamedClassDeclaration;
    createInput: NamedClassDeclaration;
    updateInput: NamedClassDeclaration;
    whereInput: NamedClassDeclaration;
    whereUniqueInput: NamedClassDeclaration;
  };
};

export function createDTOModules(dtos: DTOs): Module[] {
  const dtoNameToPath = getDTONameToPath(dtos);
  return Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs).map((dto) => createDTOModule(dto, dtoNameToPath))
  );
}

export function getDTONameToPath(dtos: DTOs): Record<string, string> {
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        createDTOModulePath(camelCase(entityName), dto.id.name),
      ])
    )
  );
}

export function createDTOs(
  entities: Entity[],
  entityIdToName: Record<string, string>
): DTOs {
  return Object.fromEntries(
    entities.map((entity) => {
      const entityDTO = createEntityDTO(entity, entityIdToName);
      const createInput = createCreateInput(entity, entityIdToName);
      const updateInput = createUpdateInput(entity, entityIdToName);
      const whereInput = createWhereInput(entity, entityIdToName);
      const whereUniqueInput = createWhereUniqueInput(entity, entityIdToName);
      const enumFields = getEnumFields(entity);
      const enumDTOs = Object.fromEntries(
        enumFields.map((field) => {
          const enumDTO = createEnumDTO(field);
          return [createEnumName(field), enumDTO];
        })
      );
      const dtos = {
        ...enumDTOs,
        entity: entityDTO,
        createInput,
        updateInput,
        whereInput,
        whereUniqueInput,
      };
      return [entity.name, dtos];
    })
  );
}
