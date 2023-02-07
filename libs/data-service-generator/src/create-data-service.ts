import { DSGResourceData, Module } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import winston from "winston";
import { createAdminModules } from "./admin/create-admin";
import { createLog } from "./create-log";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { defaultLogger } from "./server/logging";
import { createDTOs } from "./server/resource/create-dtos";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  logger: winston.Logger = defaultLogger,
  pluginInstallationPath?: string
): Promise<Module[]> {
  try {
    if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
      logger.info("No code to generate for a message broker");
      return [];
    }

    const timer = logger.startTimer();

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

    timer.done({ message: "Application creation time" });

    /** @todo make module paths to always use Unix path separator */
    return modules.map((module) => ({
      ...module,
      path: normalize(module.path),
    }));
  } catch (error) {
    await createLog({
      level: "info",
      message: "Failed to run createDataServiceImpl",
      data: JSON.stringify(dSGResourceData),
    });
    logger.error((error as Error).stack);
    return [];
  }
}
