import * as path from "path";
import * as winston from "winston";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity, Role, AppInfo, Module } from "../types";
import { formatCode } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { updatePackageJSONs } from "../update-package-jsons";
import { DTOs } from "../server/resource/create-dtos";
import { createAppModule } from "./app/create-app";
import { createDTOModules } from "./create-dto-modules";
import { createEntitiesComponents } from "./entity/create-entities-components";
import { createEntityTitleComponents } from "./entity/create-entity-title-components";
import {
  createEntityComponentsModules,
  createEntityTitleComponentsModules,
} from "./entity/create-entity-components-modules";
import { createPublicFiles } from "./public-files/create-public-files";
import { createDTONameToPath } from "./create-dto-name-to-path";
import { BASE_DIRECTORY } from "./constants";
import { createEntityToDirectory } from "./create-entity-to-directory";
import { createEnumRolesModule } from "./create-enum-roles";
import { createRolesModule } from "./create-roles-module";

const STATIC_MODULES_PATH = path.join(__dirname, "static");
const API_PATHNAME = "/api";

export async function createAdminModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Creating admin...");
  logger.info("Copying static modules...");
  const rawStaticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    BASE_DIRECTORY
  );
  const staticModules = updatePackageJSONs(rawStaticModules, BASE_DIRECTORY, {
    name: `${paramCase(appInfo.name)}-admin`,
    version: appInfo.version,
  });

  /**@todo: add code to auto import static DTOs from /server/static/src/util and strip the decorators
   * currently the files were manually copied to /admin/static/src/util
   */

  const entityToPath = Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `/${paramCase(plural(entity.name))}`,
    ])
  );
  const entityToResource = Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `${API_PATHNAME}/${paramCase(plural(entity.name))}`,
    ])
  );
  const entityNameToEntity = Object.fromEntries(
    entities.map((entity) => [entity.name, entity])
  );

  const publicFilesModules = await createPublicFiles(appInfo);
  const entityToDirectory = createEntityToDirectory(entities);
  const dtoNameToPath = createDTONameToPath(dtos);
  const dtoModules = createDTOModules(dtos, dtoNameToPath);
  const enumRolesModule = createEnumRolesModule(roles);
  const rolesModule = createRolesModule(roles);

  // Create title components first so they are available when creating entity modules
  const entityToTitleComponent = await createEntityTitleComponents(
    entities,
    dtos,
    entityToDirectory,
    entityToResource,
    dtoNameToPath
  );

  const entityTitleComponentsModules = await createEntityTitleComponentsModules(
    entityToTitleComponent
  );

  const entitiesComponents = await createEntitiesComponents(
    entities,
    dtos,
    entityToDirectory,
    entityToTitleComponent,
    entityNameToEntity
  );
  const entityComponentsModules = await createEntityComponentsModules(
    entitiesComponents
  );
  const appModule = await createAppModule(
    appInfo,
    entityToPath,
    entitiesComponents
  );
  const createdModules = [
    appModule,
    enumRolesModule,
    rolesModule,
    ...dtoModules,
    ...entityTitleComponentsModules,
    ...entityComponentsModules,
  ];
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [...staticModules, ...publicFilesModules, ...formattedModules];
}
