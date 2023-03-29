import { DSGResourceData, Module } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import { createAdminModules } from "./admin/create-admin";
import { createLog } from "./create-log";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { ILogger } from "@amplication/util/logging";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  logger: ILogger,
  pluginInstallationPath?: string
): Promise<Module[]> {
  try {
    if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
      logger.info("No code to generate for a message broker");
      return [];
    }

    const startTime = Date.now();
    await prepareContext(dSGResourceData, logger, pluginInstallationPath);
    await createLog({ level: "info", message: "Creating application..." });
    logger.info("Creating application...");

    const context = DsgContext.getInstance;
    const { appInfo } = context;
    const { settings } = appInfo;

    await createLog({ level: "info", message: "Copying static modules..." });
    logger.info("Copying static modules...");
    const serverModules = await createServer();

    const { adminUISettings } = settings;
    const { generateAdminUI } = adminUISettings;

    const adminUIModules =
      (generateAdminUI && (await createAdminModules())) || [];

    // Use concat for the best performance (https://jsbench.me/o8kqzo8olz/1)
    const modules = serverModules.concat(adminUIModules);

    const endTime = Date.now();
    logger.info("Application creation time", {
      durationInMs: endTime - startTime,
    });

    /** @todo make module paths to always use Unix path separator */
    return modules.map((module) => ({
      ...module,
      path: normalize(module.path),
    }));
  } catch (error) {
    await createLog({
      level: "error",
      message: "Failed to run createDataService",
      data: JSON.stringify(dSGResourceData),
    });
    throw error;
  }
}
