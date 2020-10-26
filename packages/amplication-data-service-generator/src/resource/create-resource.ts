import * as path from "path";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import * as winston from "winston";
import { Module } from "../util/module";
import { getEnumFields, validateEntityName } from "../util/entity";
import { Entity } from "../types";
import { createServiceModule } from "./service/create-service";
import { createControllerModule } from "./controller/create-controller";
import { createModule } from "./module/create-module";
import { createTestModule } from "./test/create-test";
import { createDTOModule } from "./dto/create-dto-module";
import { createCreateInput } from "./dto/create-create-input";
import { createUpdateInput } from "./dto/create-update-input";
import { createWhereInput } from "./dto/create-where-input";
import { createWhereUniqueInput } from "./dto/create-where-unique-input";
import { createEntityDTO } from "./dto/create-entity-dto";
import { createEnumDTO } from "./dto/create-enum-dto";

export async function createResourcesModules(
  entities: Entity[],
  entityIdToName: Record<string, string>,
  logger: winston.Logger
): Promise<Module[]> {
  const resourceModuleLists = await Promise.all(
    entities.map((entity) =>
      createResourceModules(entity, entityIdToName, entities, logger)
    )
  );
  return flatten(resourceModuleLists);
}

async function createResourceModules(
  entity: Entity,
  entityIdToName: Record<string, string>,
  entities: Entity[],
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
  const dtoModules = dtos.map((dto) =>
    createDTOModule(dto, entityName, entities)
  );

  const controllerModule = await createControllerModule(
    resource,
    entityName,
    entityType,
    serviceModule.path,
    entity,
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
