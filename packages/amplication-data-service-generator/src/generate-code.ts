import { DSGResourceData, Module } from "@amplication/code-gen-types";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { dynamicPluginInstallation } from "./dynamic-plugin-installation";
import { defaultLogger } from "./server/logging";
import { httpClient } from "./util/http-client";

const [, , source, destination] = process.argv;
if (!source) {
  throw new Error("SOURCE is not defined");
}
if (!destination) {
  throw new Error("DESTINATION is not defined");
}

generateCode(source, destination).catch((err) => {
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

    console.log("Start code generation dynamic plugins installation");
    await dynamicPluginInstallation(
      pluginInstallations.map((plugin) => plugin.npm)
    );
    console.log("Finish code generation dynamic plugins installation");

    const modules = await (
      await import("./create-data-service-impl")
    ).createDataServiceImpl(resourceData, defaultLogger);
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
