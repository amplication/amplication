import { DSGResourceData, ModuleMap } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import { createAdminModules } from "./admin/create-admin";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { ILogger } from "@amplication/util/logging";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  internalLogger: ILogger,
  pluginInstallationPath?: string
): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  try {
    if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
      internalLogger.info("No code to generate for a message broker");
      return null;
    }

    const startTime = Date.now();
    await prepareContext(
      dSGResourceData,
      internalLogger,
      pluginInstallationPath
    );

    await context.logger.info("Creating application...", {
      resourceId: dSGResourceData.resourceInfo.id,
      buildId: dSGResourceData.buildId,
    });

    const { appInfo } = context;
    const { settings } = appInfo;

    await context.logger.info("Copying static modules...");
    const serverModules = await createServer();

    const { adminUISettings } = settings;
    const { generateAdminUI } = adminUISettings;

    const adminUIModules =
      (generateAdminUI && (await createAdminModules())) ||
      new ModuleMap(context.logger);

    const modules = serverModules;
    await modules.merge(adminUIModules);

    // This code normalizes the path of each module to always use Unix path separator.
    await modules.replaceModulesPath((path) => normalize(path));

    const endTime = Date.now();
    internalLogger.info("Application creation time", {
      durationInMs: endTime - startTime,
    });

    internalLogger.info("App generation process finished successfully");

    return modules;
  } catch (error) {
    await internalLogger.error("Failed to run createDataService", {
      ...error,
    });
    throw error;
  }
}
