import { namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  DTOs,
  Entity,
  Module,
  NamedClassDeclaration,
  EntityEnumDTOs,
  EntityDTOs,
  EventNames,
  CreateDTOsParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { getEnumFields } from "../../utils/entity";
import { createEnumName } from "../prisma/create-prisma-schema-fields";
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
import { createCountArgs } from "./dto/graphql/count/create-count-args";
import { createFindManyArgs } from "./dto/graphql/find-many/create-find-many-args";
import { createFindOneArgs } from "./dto/graphql/find-one/create-find-one-args";
import { createOrderByInput } from "./dto/graphql/order-by-input/order-by-input";
import { createUpdateArgs } from "./dto/graphql/update/create-update-args";
import { createCreateNestedManyDTOs } from "./dto/nested-input-dto/create-nested";
import { createUpdateManyWithoutInputDTOs } from "./dto/nested-input-dto/update-nested";
import { createEntityListRelationFilter } from "./dto/graphql/entity-list-relation-filter/create-entity-list-relation-filter";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";

export async function createDTOModules(dtos: DTOs): Promise<ModuleMap> {
  return pluginWrapper(createDTOModulesInternal, EventNames.CreateDTOs, {
    dtos,
  });
}

/**
 * creating all the DTOs files in the base (only the DTOs)
 *
 */
export async function createDTOModulesInternal({
  dtos,
}: CreateDTOsParams): Promise<ModuleMap> {
  const dtoNameToPath = getDTONameToPath(dtos);
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  const entityDTOs = Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs)
  );

  for (const dto of entityDTOs) {
    const isEnumDTO = namedTypes.TSEnumDeclaration.check(dto);
    let module: Module;
    if (isEnumDTO) {
      module = createEnumDTOModule(dto, dtoNameToPath);
    } else {
      module = createDTOModule(dto, dtoNameToPath);
    }

    await moduleMap.set(module);
  }
  return moduleMap;
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
  const entitiesDTOsMap = await Promise.all(
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
  );
  return Object.fromEntries(entitiesDTOsMap);
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
  const countArgs = await createCountArgs(entity, whereInput);
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
    countArgs,
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
