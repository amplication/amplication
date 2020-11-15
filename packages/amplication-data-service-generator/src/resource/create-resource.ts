import * as path from "path";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import * as winston from "winston";
import { Entity } from "../types";
import { Module } from "../util/module";
import { validateEntityName } from "../util/entity";
import { DTOs } from "./create-dtos";
import { createServiceModule } from "./service/create-service";
import { createControllerModule } from "./controller/create-controller";
import { createModule } from "./module/create-module";
import { createTestModule } from "./test/create-test";

export async function createResourcesModules(
  entities: Entity[],
  entityIdToName: Record<string, string>,
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  const entitiesByName = Object.fromEntries(
    entities.map((entity) => [entity.name, entity])
  );

  const resourceModuleLists = await Promise.all(
    entities.map((entity) =>
      createResourceModules(
        entity,
        entityIdToName,
        dtos,
        entitiesByName,
        logger
      )
    )
  );
  const resourcesModules = flatten(resourceModuleLists);
  return resourcesModules;
}

async function createResourceModules(
  entity: Entity,
  entityIdToName: Record<string, string>,
  dtos: DTOs,
  entitiesByName: Record<string, Entity>,
  logger: winston.Logger
): Promise<Module[]> {
  const entityType = entity.name;

  validateEntityName(entityType);

  logger.info(`Creating ${entityType}...`);
  const entityName = camelCase(entityType);
  const resource = paramCase(plural(entityName));
  const entityModulePath = path.join(entityName, `${entityName}.module.ts`);

  const serviceModule = await createServiceModule(entityName, entityType);

  const controllerModule = await createControllerModule(
    resource,
    entityName,
    entityType,
    serviceModule.path,
    entity,
    dtos,
    entityIdToName,
    entitiesByName
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

  return [serviceModule, controllerModule, resourceModule, testModule];
}
