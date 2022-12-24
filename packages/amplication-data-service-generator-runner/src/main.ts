import { DSGResourceData, Module } from "@amplication/code-gen-types";
import {
  createDataService,
  defaultLogger,
  httpClient,
} from "@amplication/data-service-generator";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import {
  dynamicPackagesInstallations,
  pluginCustomPluginsGetterFunction,
} from "./dynamic-package-installation";

const buildSpecPath = process.env.BUILD_SPEC_PATH;
const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

if (!buildSpecPath) {
  throw new Error("SOURCE is not defined");
}
if (!buildOutputPath) {
  throw new Error("DESTINATION is not defined");
}

generateCode(buildSpecPath, buildOutputPath).catch((err) => {
  console.error(err);
  process.exit(1);
});

async function readInputJson(filePath: string): Promise<DSGResourceData> {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
}
export default async function generateCode(
  source: string,
  destination: string
): Promise<void> {
  try {
    const resourceData = await readInputJson(source);
    const { pluginInstallations } = resourceData;

    await dynamicPackagesInstallations(pluginInstallations);

    const modules = await createDataService(
      resourceData,
      defaultLogger,
      pluginCustomPluginsGetterFunction
    );
    await writeModules(modules, destination);
    console.log("Code generation completed successfully");
    await httpClient.post(
      new URL(
        "build-runner/code-generation-success",
        process.env.BUILD_MANAGER_URL
      ).href,
      {
        resourceId: process.env.RESOURCE_ID,
        buildId: process.env.BUILD_ID,
      }
    );
  } catch (err) {
    console.error(err);
    await httpClient.post(
      new URL(
        "build-runner/code-generation-failure",
        process.env.BUILD_MANAGER_URL
      ).href,
      {
        resourceId: process.env.RESOURCE_ID,
        buildId: process.env.BUILD_ID,
      }
    );
  }
}

async function writeModules(
  modules: Module[],
  destination: string
): Promise<void> {
  console.log("Creating base directory");
  await mkdir(destination, { recursive: true });
  console.info(`Writing modules to ${destination} ...`);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = join(destination, module.path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, module.code);
    })
  );
  console.info(`Successfully wrote modules to ${destination}`);
}
