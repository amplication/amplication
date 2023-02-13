import { DSGResourceData, Module } from "@amplication/code-gen-types";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { createDataService } from "./create-data-service";
import { dynamicPackagesInstallations } from "./dynamic-package-installation";
import { logger } from "./logger";
import { prepareDefaultPlugins } from "./utils/dynamic-installation/defaultPlugins";

export const AMPLICATION_MODULES = "amplication_modules";

export const generateCodeByResourceData = async (
  resourceData: DSGResourceData,
  destination: string
): Promise<void> => {
  const { pluginInstallations } = resourceData;

  const allPlugins = prepareDefaultPlugins(pluginInstallations);

  await dynamicPackagesInstallations(allPlugins, logger);

  const modules = await createDataService(
    { ...resourceData, pluginInstallations: allPlugins },
    logger,
    join(__dirname, "..", AMPLICATION_MODULES)
  );

  await writeModules(modules, destination);
  logger.info("Code generation completed successfully");
};

async function writeModules(
  modules: Module[],
  destination: string
): Promise<void> {
  logger.info("Creating base directory");
  await mkdir(destination, { recursive: true });
  logger.info(`Writing modules to ${destination} ...`);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = join(destination, module.path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, module.code);
    })
  );
  logger.info(`Successfully wrote modules to ${destination}`);
}
