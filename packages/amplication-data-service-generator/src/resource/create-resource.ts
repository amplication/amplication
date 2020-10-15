import * as path from "path";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import * as winston from "winston";
import { Module } from "../util/module";
import { createServiceModule } from "./service/create-service";
import { createControllerModule } from "./controller/create-controller";
import { createModule } from "./module/create-module";
import { createTestModule } from "./test/create-test";
import {
  createCreateInput,
  createDTOModule,
  createEntityDTO,
  createEnumDTO,
  createUpdateInput,
  createWhereInput,
  createWhereUniqueInput,
} from "./dto/create-dto";
import { Entity } from "../types";
import { getEnumFields, validateEntityName } from "../util/entity";

export async function createResourcesModules(
  entities: Entity[],
  entityIdToName: Record<string, string>,
  logger: winston.Logger
): Promise<Module[]> {
  const resourceModuleLists = await Promise.all(
    entities.map((entity) =>
      createResourceModules(entity, entityIdToName, logger)
    )
  );
  return flatten(resourceModuleLists);
}

async function createResourceModules(
  entity: Entity,
  entityIdToName: Record<string, string>,
  logger: winston.Logger
): Promise<Module[]> {
  const entityType = entity.name;

  validateEntityName(entityType);

  logger.info(`Creating ${entityType}...`);
  const entityName = camelCase(entityType);
  const resource = paramCase(plural(entityName));
  const entityModulePath = path.join(entityName, `${entityName}.module.ts`);

  const serviceModule = await createServiceModule(entityName, entityType);

  const createInput = createCreateInput(entity, entityIdToName);
  const updateInput = createUpdateInput(entity, entityIdToName);
  const whereInput = createWhereInput(entity, entityIdToName);
  const whereUniqueInput = createWhereUniqueInput(entity, entityIdToName);
  const entityDTO = createEntityDTO(entity, entityIdToName);
  const enumFields = getEnumFields(entity);
  const enumDTOs = enumFields.map(createEnumDTO);
  const dtos = [
    createInput,
    updateInput,
    whereInput,
    whereUniqueInput,
    entityDTO,
    ...enumDTOs,
  ];
  const entityNames = Object.values(entityIdToName);
  const dtoModules = dtos.map((dto) =>
    createDTOModule(dto, entityName, entityNames)
  );

  const controllerModule = await createControllerModule(
    resource,
    entityName,
    entityType,
    serviceModule.path,
    {
      createInput,
      updateInput,
      whereInput,
      whereUniqueInput,
      entityDTO,
    }
  );

  const resourceModule = await createModule(
    entityModulePath,
    entityType,
    serviceModule.path,
    controllerModule.path
  );

  const testModule = await createTestModule(
    resource,
    entity,
    entityName,
    entityType,
    serviceModule.path,
    resourceModule.path,
    entityIdToName
  );

  return [
    ...dtoModules,
    serviceModule,
    controllerModule,
    resourceModule,
    testModule,
  ];
}
