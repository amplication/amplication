import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import * as winston from "winston";
import { Entity, Module } from "../../types";
import { validateEntityName } from "../../util/entity";
import { DTOs } from "./create-dtos";
import { createServiceModule } from "./service/create-service";
import { createControllerModule } from "./controller/create-controller";
import { createModule } from "./module/create-module";
import { createControllerSpecModule } from "./test/create-controller-spec";
import { createResolverModule } from "./resolver/create-resolver";

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

  const serviceModule = await createServiceModule(
    entityName,
    entityType,
    entity
  );

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

  const resolverModule = await createResolverModule(
    entityName,
    entityType,
    serviceModule.path,
    entity,
    dtos,
    entityIdToName,
    entitiesByName
  );

  const resourceModule = await createModule(
    entityName,
    entityType,
    serviceModule.path,
    controllerModule.path
  );

  const testModule = await createControllerSpecModule(
    resource,
    entity,
    entityType,
    serviceModule.path,
    controllerModule.path,
    entityIdToName
  );

  return [
    serviceModule,
    controllerModule,
    resolverModule,
    resourceModule,
    testModule,
  ];
}
