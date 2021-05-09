import { camelCase } from "camel-case";
import { namedTypes } from "ast-types";
import { Entity, Module } from "../../types";
import { NamedClassDeclaration } from "../../util/ast";
import { getEnumFields } from "../../util/entity";
import { createEnumName } from "../prisma/create-prisma-schema";
import { createCreateInput } from "./dto/create-create-input";
import { createEntityDTO } from "./dto/create-entity-dto";
import { createEnumDTO } from "./dto/create-enum-dto";
import { createUpdateInput } from "./dto/create-update-input";
import { createWhereInput } from "./dto/create-where-input";
import { createWhereUniqueInput } from "./dto/create-where-unique-input";
import { createDTOModule, createDTOModulePath } from "./dto/create-dto-module";
import { createEnumDTOModule } from "./dto/create-enum-dto-module";
import { createCreateArgs } from "./dto/graphql/create/create-create-args";
import { createOrderByInput } from "./dto/graphql/order-by-input/order-by-input";
import { createDeleteArgs } from "./dto/graphql/delete/create-delete-args";
import { createFindManyArgs } from "./dto/graphql/find-many/create-find-many-args";
import { createFindOneArgs } from "./dto/graphql/find-one/create-find-one-args";
import { createUpdateArgs } from "./dto/graphql/update/create-update-args";

type EntityDTOs = {
  entity: NamedClassDeclaration;
  createInput: NamedClassDeclaration;
  updateInput: NamedClassDeclaration;
  whereInput: NamedClassDeclaration;
  whereUniqueInput: NamedClassDeclaration;
  deleteArgs: NamedClassDeclaration;
  findManyArgs: NamedClassDeclaration;
  findOneArgs: NamedClassDeclaration;
  createArgs?: NamedClassDeclaration;
  updateArgs?: NamedClassDeclaration;
  orderByInput: NamedClassDeclaration;
};

type EntityEnumDTOs = {
  [dto: string]: namedTypes.TSEnumDeclaration;
};

export type DTOs = {
  [entity: string]: EntityEnumDTOs & EntityDTOs;
};

export function createDTOModules(dtos: DTOs): Module[] {
  const dtoNameToPath = getDTONameToPath(dtos);
  return Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs).map((dto) =>
      namedTypes.TSEnumDeclaration.check(dto)
        ? createEnumDTOModule(dto, dtoNameToPath)
        : createDTOModule(dto, dtoNameToPath)
    )
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

export async function createDTOs(entities: Entity[]): Promise<DTOs> {
  return Object.fromEntries(
    await Promise.all(
      entities.map(async (entity) => {
        const entityDTOs = await createEntityDTOs(entity);
        const entityEnumDTOs = createEntityEnumDTOs(entity);
        const dtos = {
          ...entityDTOs,
          ...entityEnumDTOs,
        };
        return [entity.name, dtos];
      })
    )
  );
}

async function createEntityDTOs(entity: Entity): Promise<EntityDTOs> {
  const entityDTO = createEntityDTO(entity);
  const createInput = createCreateInput(entity);
  const updateInput = createUpdateInput(entity);
  const whereInput = createWhereInput(entity);
  const whereUniqueInput = createWhereUniqueInput(entity);
  const createArgs = await createCreateArgs(entity, createInput);
  const orderByInput = await createOrderByInput(entity);
  const deleteArgs = await createDeleteArgs(entity, whereUniqueInput);
  const findManyArgs = await createFindManyArgs(
    entity,
    whereInput,
    orderByInput
  );
  const findOneArgs = await createFindOneArgs(entity, whereUniqueInput);
  const updateArgs = await createUpdateArgs(
    entity,
    whereUniqueInput,
    updateInput
  );
  const dtos: EntityDTOs = {
    entity: entityDTO,
    createInput,
    updateInput,
    whereInput,
    whereUniqueInput,
    deleteArgs,
    findManyArgs,
    findOneArgs,
    orderByInput,
  };
  if (createArgs) {
    dtos.createArgs = createArgs;
  }
  if (updateArgs) {
    dtos.updateArgs = updateArgs;
  }
  return dtos;
}

function createEntityEnumDTOs(entity: Entity): EntityEnumDTOs {
  const enumFields = getEnumFields(entity);
  return Object.fromEntries(
    enumFields.map((field) => {
      const enumDTO = createEnumDTO(field, entity);
      return [createEnumName(field, entity), enumDTO];
    })
  );
}
