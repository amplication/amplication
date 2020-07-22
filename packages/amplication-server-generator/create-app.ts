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
  console.info("Reading static modules...");
  const staticModules = await readStatic();

  console.log("Creating api module...");
  const apiModule = createAPIModule(api);

  console.log("Creating dynamic modules...");
  const resourcesModules = await createResourcesModules(api);
  const schemaModules = createDTOModules(api);
  const appModule = await createAppModule(resourcesModules);

  const createdModules = [...resourcesModules, ...schemaModules, appModule];

  console.log("Formatting dynamic modules...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));

  return [...staticModules, apiModule, ...formattedModules];
}

function createAPIModule(api: OpenAPIObject): Module {
  return { code: JSON.stringify(api), path: "api.json" };
}

async function readStatic(): Promise<Module[]> {
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
