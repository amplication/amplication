import * as path from "path";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import { Module } from "../util/module";
import { createServiceModule } from "./service/create-service";
import { createControllerModule } from "./controller/create-controller";
import { createModule } from "./module/create-module";
import { createTestModule } from "./test/create-test";
import { Entity } from "../models";

export async function createResourcesModules(
  entities: Entity[]
): Promise<Module[]> {
  const resourceModuleLists = await Promise.all(
    entities.map((entity) => createResourceModules(entity))
  );
  return flatten(resourceModuleLists);
}

async function createResourceModules(entity: Entity): Promise<Module[]> {
  const entityType = entity.name;
  const entityName = camelCase(entityType);
  const resource = paramCase(plural(entityName));
  const entityModulePath = path.join(entityName, `${entityName}.module.ts`);

  const serviceModule = await createServiceModule(entityName, entityType);

  const controllerModule = await createControllerModule(
    resource,
    entityName,
    entityType,
    serviceModule.path
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
    resourceModule.path
  );

  return [serviceModule, controllerModule, resourceModule, testModule];
}
