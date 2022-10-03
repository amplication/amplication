import { DSGResourceData, Module } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import winston from "winston";
import { createAdminModules } from "./admin/create-admin";
import DsgContext from "./dsg-context";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { createDTOs } from "./server/resource/create-dtos";

export async function createDataServiceImpl(
  dSGResourceData: DSGResourceData,
  logger: winston.Logger
): Promise<Module[]> {
  const timer = logger.startTimer();

  await prepareContext(dSGResourceData, logger);
  logger.info("Creating application...");

  const context = DsgContext.getInstance;

  logger.info("Creating DTOs...");
  const dtos = await createDTOs(context.entities);
  context.DTOs = dtos;

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
}
