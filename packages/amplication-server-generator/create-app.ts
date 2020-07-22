import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";
import fg from "fast-glob";

import { formatCode, Module } from "./util/module";
import { createDTOModules } from "./create-dto";
import { createResourcesModules } from "./resource/create-resource";
import { createAppModule } from "./create-app-module";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createApp(api: OpenAPIObject): Promise<Module[]> {
  const staticModules = await readStatic();

  const apiModule = createAPIModule(api);

  const dynamicModules = await createDynamicModules(api);

  return [...staticModules, apiModule, ...dynamicModules];
}

async function createDynamicModules(api: OpenAPIObject): Promise<Module[]> {
  console.info("Dynamic | Creating resources modules...");
  const resourcesModules = await createResourcesModules(api);
  console.info("Dynamic | Creating DTO modules...");
  const dtoModules = createDTOModules(api);
  console.info("Dynamic | Creating application module...");
  const appModule = await createAppModule(resourcesModules);
  const createdModules = [...resourcesModules, ...dtoModules, appModule];
  console.info("Dynamic | Formatting modules...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return formattedModules;
}

function createAPIModule(api: OpenAPIObject): Module {
  console.info("Creating API module...");
  return { code: JSON.stringify(api), path: "api.json" };
}

async function readStatic(): Promise<Module[]> {
  console.info("Reading static modules...");
  const staticModules = await fg(`${STATIC_DIRECTORY}/**/*\\.(ts|json)`, {
    absolute: false,
  });

  return Promise.all(
    staticModules.map(async (module) => ({
      path: module.replace(STATIC_DIRECTORY, ""),
      code: await fs.promises.readFile(module, "utf-8"),
    }))
  );
}
