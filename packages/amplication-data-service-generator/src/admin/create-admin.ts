import * as path from "path";
import * as winston from "winston";
import { Entity, Role, AppInfo, Module } from "../types";
import { formatCode } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { DTOs } from "../server/resource/create-dtos";
import { createNavigationModule } from "./navigation/create-navigation";
import { createAppModule } from "./app/create-app";
import { createDTOModules } from "./create-dto-modules";
import { createEntitiesComponents } from "./entity/create-entities-components";
import { createEntitySelectComponents } from "./entity/create-entity-select-components";
import {
  createEntityComponentsModules,
  createEntitySelectComponentsModules,
} from "./entity/create-entity-components-modules";
import { createPublicFiles } from "./public-files/create-public-files";
import { createDTONameToPath } from "./create-dto-name-to-path";
import { BASE_DIRECTORY } from "./constants";
import { createEntityToDirectory } from "./create-entity-to-directory";
import { createEnumRolesModule } from "./create-enum-roles";
import { createRolesModule } from "./create-roles-module";

const STATIC_MODULES_PATH = path.join(__dirname, "static");

export async function createAdminModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  entityIdToName: Record<string, string>,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Creating admin...");
  logger.info("Copying static modules...");
  const staticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    BASE_DIRECTORY
  );
  const publicFilesModules = await createPublicFiles(appInfo);
  const navigationModule = await createNavigationModule(entities);
  const entityToDirectory = createEntityToDirectory(entities);
  const dtoNameToPath = createDTONameToPath(dtos);
  const dtoModules = createDTOModules(dtos, dtoNameToPath);
  const enumRolesModule = createEnumRolesModule(roles);
  const rolesModule = createRolesModule(roles);

  // Create select components first so they are available when creating entity modules
  const entityToSelectComponent = await createEntitySelectComponents(
    entities,
    dtos,
    entityToDirectory,
    dtoNameToPath
  );

  const entitySelectComponentsModules = await createEntitySelectComponentsModules(
    entityToSelectComponent
  );

  const entitiesComponents = await createEntitiesComponents(
    entities,
    dtos,
    entityToDirectory,
    dtoNameToPath,
    entityIdToName,
    entityToSelectComponent
  );
  const entityComponentsModules = await createEntityComponentsModules(
    entitiesComponents
  );
  const appModule = await createAppModule(appInfo, entitiesComponents);
  const createdModules = [
    appModule,
    navigationModule,
    enumRolesModule,
    rolesModule,
    ...dtoModules,
    ...entitySelectComponentsModules,
    ...entityComponentsModules,
  ];
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [...staticModules, ...publicFilesModules, ...formattedModules];
}
