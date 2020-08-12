import * as fs from "fs";
import * as path from "path";

import fg from "fast-glob";

import { formatCode, Module } from "./util/module";
import { Entity } from "./models";
import { createResourcesModules } from "./resource/create-resource";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createDataService(entities: Entity[]): Promise<Module[]> {
  console.info("Creating application...");
  console.time("Application creation time");
  const staticModules = await readStaticModules();

  const dynamicModules = await createDynamicModules(entities, staticModules);

  console.timeEnd("Application creation time");

  return [...staticModules, ...dynamicModules];
}

async function createDynamicModules(
  entities: Entity[],
  staticModules: Module[]
): Promise<Module[]> {
  console.info("Dynamic | Creating resources modules...");
  const resourcesModules = await createResourcesModules(entities);

  console.info("Dynamic | Creating application module...");
  const appModule = await createAppModule(resourcesModules, staticModules);

  const createdModules = [...resourcesModules, appModule];

  console.info("Dynamic | Formatting modules...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));

  console.info("Dynamic | Creating prisma module...");
  const prismaSchemaModule = await createPrismaSchemaModule(entities);

  return [...formattedModules, prismaSchemaModule];
}

async function readStaticModules(): Promise<Module[]> {
  console.info("Reading static modules...");
  const staticModules = await fg(`${STATIC_DIRECTORY}/**/*`, {
    absolute: false,
  });

  return Promise.all(
    staticModules.map(async (module) => ({
      path: module.replace(STATIC_DIRECTORY + path.sep, ""),
      code: await fs.promises.readFile(module, "utf-8"),
    }))
  );
}
