import * as path from "path";
import * as winston from "winston";
import { Entity } from "../types";
import { formatCode, Module } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { createNavigationModule } from "./navigation/create-navigation";
import { createAppModule } from "./app/create-app";
import { createEntity as createEntityModule } from "./entity/create-entity";

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
  const appModule = await createAppModule(entities);
  const navigationModule = await createNavigationModule(entities);
  const entityModules = await Promise.all(entities.map(createEntityModule));
  const createdModules = [appModule, navigationModule, ...entityModules];
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [...staticModules, ...formattedModules];
}
