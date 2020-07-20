import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";

import { writeModules } from "./util/module";
import { recursiveCopy } from "./util/fs";
import { createDTOModules } from "./create-dto";
import { createResourcesModules } from "./resource/create-resource";
import { createAppModule } from "./create-app-module";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");
const DEFAULT_OUTPUT_DIRECTORY = "dist";

export async function createApp(
  api: OpenAPIObject,
  outputDirectory = DEFAULT_OUTPUT_DIRECTORY,
  cleanDirectory = true
): Promise<void> {
  if (cleanDirectory) {
    console.info("Cleaning up directory...");
    await fs.promises.rmdir(outputDirectory, {
      recursive: true,
    });
  }

  const resourcesModules = await createResourcesModules(api);
  const schemaModules = createDTOModules(api);
  const appModule = await createAppModule(resourcesModules);

  const modules = [...resourcesModules, ...schemaModules, appModule];

  console.info("Writing generated modules...");
  await writeModules(modules, outputDirectory);

  console.info("Copying static modules...");
  await copyStatic(outputDirectory);

  await fs.promises.writeFile(
    path.join(outputDirectory, "api.json"),
    JSON.stringify(api)
  );
}

async function copyStatic(outputDirectory: string): Promise<void> {
  const staticPaths = await fs.promises.readdir(STATIC_DIRECTORY);
  await Promise.all(
    staticPaths.map((staticPath) =>
      recursiveCopy(
        path.join(STATIC_DIRECTORY, staticPath),
        path.join(outputDirectory, staticPath)
      )
    )
  );
}
