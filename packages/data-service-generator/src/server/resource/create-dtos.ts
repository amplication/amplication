import { namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  DTOs,
  Entity,
  NamedClassDeclaration,
  EntityEnumDTOs,
  EntityDTOs,
  EventNames,
  CreateDTOsParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { getEnumFields } from "../../utils/entity";
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
import { createEnumName } from "@amplication/dsg-utils";

export async function createDTOModules(
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  return pluginWrapper(createDTOModulesInternal, EventNames.CreateDTOs, {
    dtos,
    dtoNameToPath,
  });
}

/**
 * creating all the DTOs files in the base (only the DTOs)
 *
 */
export async function createDTOModulesInternal({
  dtos,
  dtoNameToPath,
}: CreateDTOsParams): Promise<ModuleMap> {
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  const entityDTOs = Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs)
  );

  await Promise.all(
    entityDTOs.map((dto) => {
      const isEnumDTO = namedTypes.TSEnumDeclaration.check(dto);
      return isEnumDTO
        ? createEnumDTOModule(dto, dtoNameToPath)
        : createDTOModule(dto, dtoNameToPath);
    })
  ).then((modulesRes) => modulesRes.forEach((module) => moduleMap.set(module)));

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

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);
export const createEntityInputFiles = (entity: Entity): Partial<EntityDTOs> => {
  const fieldsLen = entity.fields.length;
  const entityDTOsFilesObj = {
    fieldsLen,
    index: 0,
    entity,
    field: null,
    entityDTO: {
      properties: [],
      DTO: null as NamedClassDeclaration,
    },
    createInput: {
      properties: [],
      DTO: null as NamedClassDeclaration,
    },
    updateInput: {
      properties: [],
      DTO: null as NamedClassDeclaration,
    },
    whereInput: {
      properties: [],
      DTO: null as NamedClassDeclaration,
    },
    whereUniqueInput: {
      properties: [],
      DTO: null as NamedClassDeclaration,
    },
  };

  for (let i = 0; i < fieldsLen; i++) {
    entityDTOsFilesObj.index = i;
    entityDTOsFilesObj.field = entity.fields[i];
    pipe(
      createEntityDTO,
      createCreateInput,
      createUpdateInput,
      createWhereInput,
      createWhereUniqueInput
    )(entityDTOsFilesObj);
  }

  return {
    entity: entityDTOsFilesObj.entityDTO.DTO,
    createInput: entityDTOsFilesObj.createInput.DTO,
    updateInput: entityDTOsFilesObj.updateInput.DTO,
    whereInput: entityDTOsFilesObj.whereInput.DTO,
    whereUniqueInput: entityDTOsFilesObj.whereUniqueInput.DTO,
  };
};

async function createEntityDTOs(entity: Entity): Promise<EntityDTOs> {
  const createEntityFiles = createEntityInputFiles(entity);
  const createArgs = await createCreateArgs(
    entity,
    createEntityFiles.createInput
  );
  const orderByInput = await createOrderByInput(entity);
  const deleteArgs = await createDeleteArgs(
    entity,
    createEntityFiles.whereUniqueInput
  );
  const countArgs = await createCountArgs(entity, createEntityFiles.whereInput);
  const findManyArgs = await createFindManyArgs(
    entity,
    createEntityFiles.whereInput,
    orderByInput
  );
  const findOneArgs = await createFindOneArgs(
    entity,
    createEntityFiles.whereUniqueInput
  );
  const updateArgs = await createUpdateArgs(
    entity,
    createEntityFiles.whereUniqueInput,
    createEntityFiles.updateInput
  );
  const listRelationFilter = await createEntityListRelationFilter(
    entity,
    createEntityFiles.whereInput
  );
  // end read file
  const dtos: EntityDTOs = {
    entity: createEntityFiles.entity,
    createInput: createEntityFiles.createInput,
    updateInput: createEntityFiles.updateInput,
    whereInput: createEntityFiles.whereInput,
    whereUniqueInput: createEntityFiles.whereUniqueInput,
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
