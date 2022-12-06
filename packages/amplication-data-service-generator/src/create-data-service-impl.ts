import { DSGResourceData, Module } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import winston from "winston";
import { createAdminModules } from "./admin/create-admin";
import { createLog } from "./create-log";
import DsgContext from "./dsg-context";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { createDTOs } from "./server/resource/create-dtos";
import { EnumResourceType } from "./models";

export async function createDataServiceImpl(
  dSGResourceData: DSGResourceData,
  logger: winston.Logger
): Promise<Module[]> {
  try {
    if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
      logger.info("No code to generate for a message broker");
      return [];
    }

    const timer = logger.startTimer();

    await prepareContext(dSGResourceData, logger);
    await createLog({ level: "info", message: "Creating application..." });
    logger.info("Creating application...");

    const context = DsgContext.getInstance;

    await createLog({ level: "info", message: "Creating DTOs..." });
    logger.info("Creating DTOs...");
    const dtos = await createDTOs(context.entities);
    context.DTOs = dtos;

    await createLog({ level: "info", message: "Copying static modules..." });
    logger.info("Copying static modules...");

    const modules = (
      await Promise.all([
        createServer(),
        (context.appInfo.settings.adminUISettings.generateAdminUI &&
          createAdminModules()) ||
          [],
      ])
    ).flat();

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
    });
    logger.error((error as Error).message);
    logger.error((error as Error).stack);
    return [];
  }
}
