import { DSGResourceData, Module } from "@amplication/code-gen-types";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { createDataService } from "./create-data-service";
import { dynamicPackagesInstallations } from "./dynamic-package-installation";
import { BuildManagerNotifier } from "./notify-build-manager";
import { logger } from "./logging";
import { prepareDefaultPlugins } from "./utils/dynamic-installation/defaultPlugins";

export const AMPLICATION_MODULES = "amplication_modules";

const readInputJson = async (filePath: string): Promise<DSGResourceData> => {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
};

const writeModules = async (
  modules: Module[],
  destination: string
): Promise<void> => {
  logger.info("Creating base directory");
  await mkdir(destination, { recursive: true });
  logger.info(`Writing modules to ${destination} ...`);

  for await (const module of modules) {
    const filePath = join(destination, module.path);
    await mkdir(dirname(filePath), { recursive: true });
    try {
      await writeFile(filePath, module.code, { flag: "wx" });
    } catch (error) {
      if (error.code === "EEXIST") {
        logger.warn(`File ${filePath} already exists`);
      } else {
        logger.error(`Failed to write file ${filePath}`, { ...error });
        throw error;
      }
    }
  }

  logger.info(`Successfully wrote modules to ${destination}`);
};

export const generateCodeByResourceData = async (
  resourceData: DSGResourceData,
  destination: string
): Promise<void> => {
  const { pluginInstallations } = resourceData;
  const dsgLogger = logger.child({
    metadata: {
      resourceId: resourceData.resourceInfo?.id,
      buildId: resourceData.buildId,
    },
  });

  const allPlugins = prepareDefaultPlugins(pluginInstallations);

  await dynamicPackagesInstallations(allPlugins, logger);

  const modules = await createDataService(
    { ...resourceData, pluginInstallations: allPlugins },
    dsgLogger,
    join(__dirname, "..", AMPLICATION_MODULES)
  );

  await writeModules(modules, destination);
  logger.info("Code generation completed successfully");
};

export const generateCode = async (): Promise<void> => {
  const buildSpecPath = process.env.BUILD_SPEC_PATH;
  const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

  if (!buildSpecPath) {
    throw new Error("SOURCE is not defined");
  }
  if (!buildOutputPath) {
    throw new Error("DESTINATION is not defined");
  }

  const buildManagerNotifier = new BuildManagerNotifier({
    buildManagerUrl: process.env.BUILD_MANAGER_URL,
    resourceId: process.env.RESOURCE_ID,
    buildId: process.env.BUILD_ID,
  });

  try {
    const resourceData = await readInputJson(buildSpecPath);
    await generateCodeByResourceData(resourceData, buildOutputPath);
    await buildManagerNotifier.success();
  } catch (error) {
    await buildManagerNotifier.failure();
    throw error;
  }
};
