import { namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  DTOs,
  Entity,
  Module,
  NamedClassDeclaration,
  EntityEnumDTOs,
  EntityDTOs,
} from "@amplication/code-gen-types";
import { getEnumFields } from "../../util/entity";
import { createEnumName } from "../prisma/create-prisma-schema";
import { createCreateInput } from "./dto/create-create-input";
import { createDTOModule, createDTOModulePath } from "./dto/create-dto-module";
import { createEntityDTO } from "./dto/create-entity-dto";
import { createEnumDTO } from "./dto/create-enum-dto";
import { createEnumDTOModule } from "./dto/create-enum-dto-module";
import { createUpdateInput } from "./dto/create-update-input";
import { createWhereInput } from "./dto/create-where-input";
import { createWhereUniqueInput } from "./dto/create-where-unique-input";
import { createCreateArgs } from "./dto/graphql/create/create-create-args";
import { createDeleteArgs } from "./dto/graphql/delete/create-delete-args";
import { createFindManyArgs } from "./dto/graphql/find-many/create-find-many-args";
import { createFindOneArgs } from "./dto/graphql/find-one/create-find-one-args";
import { createOrderByInput } from "./dto/graphql/order-by-input/order-by-input";
import { createUpdateArgs } from "./dto/graphql/update/create-update-args";
import { createCreateNestedManyDTOs } from "./dto/nested-input-dto/create-nested";
import { createUpdateManyWithoutInputDTOs } from "./dto/nested-input-dto/update-nested";
import { createEntityListRelationFilter } from "./dto/graphql/entity-list-relation-filter/create-entity-list-relation-filter";

/**
 * creating all the DTOs files in the base (only the DTOs)
 *
 */
export function createDTOModules(dtos: DTOs, srcDirectory: string): Module[] {
  const dtoNameToPath = getDTONameToPath(dtos, srcDirectory);
  return Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs).map((dto) =>
      namedTypes.TSEnumDeclaration.check(dto)
        ? createEnumDTOModule(dto, dtoNameToPath)
        : createDTOModule(dto, dtoNameToPath)
    )
  );
}

export function getDTONameToPath(
  dtos: DTOs,
  srcDirectory: string
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        createDTOModulePath(camelCase(entityName), dto.id.name, srcDirectory),
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
        const toManyDTOs = createToManyDTOs(entity);
        const dtos = {
          ...entityDTOs,
          ...entityEnumDTOs,
          ...toManyDTOs,
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
  const listRelationFilter = await createEntityListRelationFilter(
    entity,
    whereInput
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
    listRelationFilter,
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

function createToManyDTOs(entity: Entity): NamedClassDeclaration[] {
  const allCreateNestedManyWithoutInput = createCreateNestedManyDTOs(entity);
  const allUpdateManyWithoutInput = createUpdateManyWithoutInputDTOs(entity);
  return [...allCreateNestedManyWithoutInput, ...allUpdateManyWithoutInput];
}
