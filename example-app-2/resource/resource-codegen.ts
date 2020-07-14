import * as path from "path";
import { OpenAPIObject, PathObject } from "openapi3-ts";
import { singular } from "pluralize";
import { pascalCase } from "pascal-case";
import { Module } from "../util/module";
import { groupByResource } from "../util/open-api";
import flatten from "lodash.flatten";
import { createServiceModule } from "./service-codegen";
import { createControllerModule } from "./controller-codegen";
import { createResourceModule } from "./resource-module-codegen";

export async function createResourcesModules(
  api: OpenAPIObject
): Promise<Module[]> {
  const byResource = groupByResource(api);
  const resourceModuleLists = await Promise.all(
    Object.entries(byResource).map(([resource, paths]) =>
      createResourceModules(api, resource, paths)
    )
  );
  return flatten(resourceModuleLists);
}

async function createResourceModules(
  api: OpenAPIObject,
  resource: string,
  paths: PathObject
): Promise<Module[]> {
  const entity = singular(resource);
  const entityType = pascalCase(entity);
  const entityModulePath = path.join(entity, `${entity}.module.ts`);
  const entityDTOModulePath = path.join("dto", `${entityType}.ts`);

  const serviceModule = await createServiceModule(
    api,
    paths,
    entity,
    entityType,
    entityDTOModulePath
  );

  const controllerModule = await createControllerModule(
    api,
    paths,
    resource,
    entity,
    entityType,
    entityDTOModulePath,
    serviceModule.path
  );

  const resourceModule = await createResourceModule(
    entityModulePath,
    entityType,
    serviceModule.path,
    controllerModule.path
  );

  return [serviceModule, controllerModule, resourceModule];
}
