import { DSGResourceData, ModuleMap } from "@amplication/code-gen-types";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { createDataService } from "./create-data-service";
import { dynamicPackagesInstallations } from "./dynamic-package-installation";
import { BuildManagerNotifier } from "./notify-build-manager";
import { logger as internalLogger } from "./logging";
import { prepareDefaultPlugins } from "./utils/dynamic-installation/defaultPlugins";
import { getFileEncoding } from "./utils/get-file-encoding";

export const AMPLICATION_MODULES = "amplication_modules";

const readInputJson = async (filePath: string): Promise<DSGResourceData> => {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
};

const writeModules = async (
  modules: ModuleMap,
  destination: string
): Promise<void> => {
  internalLogger.info("Creating base directory");
  await mkdir(destination, { recursive: true });
  internalLogger.info(`Writing modules to ${destination} ...`);

  for await (const module of modules.modules()) {
    const filePath = join(destination, module.path);
    await mkdir(dirname(filePath), { recursive: true });
    try {
      const encoding = getFileEncoding(filePath);
      await writeFile(filePath, module.code, {
        encoding: encoding,
        flag: "wx",
      });
    } catch (error) {
      if (error.code === "EEXIST") {
        internalLogger.warn(`File ${filePath} already exists`);
      } else {
        internalLogger.error(`Failed to write file ${filePath}`, { ...error });
        throw error;
      }
    }
  }

  internalLogger.info(`Successfully wrote modules to ${destination}`);
};

export const generateCodeByResourceData = async (
  resourceData: DSGResourceData,
  destination: string
): Promise<void> => {
  try {
    const { pluginInstallations } = resourceData;

    const allPlugins = prepareDefaultPlugins(pluginInstallations);

    await dynamicPackagesInstallations(allPlugins, internalLogger);

    const modules = await createDataService(
      { ...resourceData, pluginInstallations: allPlugins },
      internalLogger,
      join(__dirname, "..", AMPLICATION_MODULES)
    );

    await writeModules(modules, destination);
  } catch (error) {
    internalLogger.error(error.message, error);
    throw error;
  }
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
