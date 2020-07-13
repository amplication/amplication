import * as path from "path";
import { OpenAPIObject, PathObject, SchemaObject } from "openapi3-ts";
import { singular } from "pluralize";
import { pascalCase } from "pascal-case";
import { Module } from "../module.util";
import { getSchemaToDelegate } from "../open-api-primsa";
import { groupByResource } from "../open-api.util";
import { PrismaClient } from "@prisma/client";
import flatten from "lodash.flatten";
import { createServiceModule } from "./service-codegen";
import { createControllerModule } from "./controller-codegen";
import { createResourceModule } from "./resource-module-codegen";

export async function createResourcesModules(
  api: OpenAPIObject,
  prismaClient: PrismaClient
): Promise<Module[]> {
  const schemaToDelegate = getSchemaToDelegate(api, prismaClient);
  const byResource = groupByResource(api);
  const resourceModuleLists = await Promise.all(
    Object.entries(byResource).map(([resource, paths]) =>
      generateResource(api, resource, paths, schemaToDelegate)
    )
  );
  return flatten(resourceModuleLists);
}

async function generateResource(
  api: OpenAPIObject,
  resource: string,
  paths: PathObject,
  schemaToDelegate: SchemaObject
): Promise<Module[]> {
  const entity = singular(resource);
  const entityType = pascalCase(entity);
  const entityModulePath = path.join(entity, `${entity}.module.ts`);
  const entityDTOModulePath = path.join("dto", `${entityType}.ts`);

  /** @todo move from definition */
  const serviceModule = await createServiceModule(
    api,
    paths,
    entity,
    entityType,
    entityDTOModulePath,
    schemaToDelegate
  );

  const controllerModule = await createControllerModule(
    api,
    paths,
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
