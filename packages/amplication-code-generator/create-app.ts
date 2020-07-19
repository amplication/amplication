import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";
import * as npm from "npm";

import { writeModules } from "./util/module";
import { recursiveCopy } from "./util/fs";
import { createDTOModules } from "./create-dto";
import { createResourcesModules } from "./resource/create-resource";
import { createAppModule } from "./create-app-module";

const DEFAULT_OUTPUT_DIRECTORY = "dist";

const STATIC_PATHS = [
  "index.ts",
  "package.json",
  "package-lock.json",
  "prisma",
];

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

  console.info("Install dependencies...");
  await installDependencies(outputDirectory);
}

async function installDependencies(outputDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const currentDirectory = process.cwd();
    process.chdir(outputDirectory);
    npm.load((err) => {
      if (err) {
        process.chdir(currentDirectory);
        reject(err);
        return;
      }
      npm.commands.install([], (err) => {
        process.chdir(currentDirectory);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

async function copyStatic(outputDirectory: string): Promise<void> {
  await Promise.all(
    STATIC_PATHS.map((staticPath) =>
      recursiveCopy(
        path.join(__dirname, "templates", staticPath),
        path.join(outputDirectory, staticPath)
      )
    )
  );
}
