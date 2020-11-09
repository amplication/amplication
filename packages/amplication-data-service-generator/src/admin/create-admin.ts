import * as path from "path";
import * as winston from "winston";
import { Entity } from "../types";
import { formatCode, Module } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { createNavigation } from "./navigation/create-navigation";

const STATIC_MODULES_PATH = path.join(__dirname, "static");

export async function createAdminModules(
  entities: Entity[],
  logger: winston.Logger
): Promise<Module[]> {
  const staticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    "admin",
    logger
  );
  const navigationModule = await createNavigation(entities);
  const createdModules = [navigationModule];
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [...staticModules, ...formattedModules];
}
