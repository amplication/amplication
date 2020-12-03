import * as path from "path";
import * as winston from "winston";
import { Entity, Role, AppInfo } from "../types";
import { formatCode, Module } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { DTOs } from "../resource/create-dtos";
import { createNavigationModule } from "./navigation/create-navigation";
import { createAppModule } from "./app/create-app";
import { createDTOModules } from "./create-dto-modules";
import { createEntitiesComponents } from "./entity/create-entities-components";
import { createEntityComponentsModules } from "./entity/create-entity-components-modules";
import { createPublicFiles } from "./public-files/create-public-files";
import { createDTONameToPath } from "./create-dto-name-to-path";
import { BASE_DIRECTORY } from "./constants";
import { createEntityToDirectory } from "./create-entity-to-directory";

const STATIC_MODULES_PATH = path.join(__dirname, "static");

export async function createAdminModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Creating admin...");
  const staticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    BASE_DIRECTORY,
    logger
  );
  const publicFilesModules = await createPublicFiles(appInfo);
  const navigationModule = await createNavigationModule(entities);
  const entityToDirectory = createEntityToDirectory(entities);
  const dtoNameToPath = createDTONameToPath(dtos);
  const dtoModules = createDTOModules(dtos, dtoNameToPath);
  const entitiesComponents = await createEntitiesComponents(
    entities,
    dtos,
    entityToDirectory,
    dtoNameToPath
  );
  const entityComponentsModules = await createEntityComponentsModules(
    entitiesComponents
  );
  const appModule = await createAppModule(entitiesComponents);
  const createdModules = [
    appModule,
    navigationModule,
    ...dtoModules,
    ...entityComponentsModules,
  ];
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [...staticModules, ...publicFilesModules, ...formattedModules];
}
