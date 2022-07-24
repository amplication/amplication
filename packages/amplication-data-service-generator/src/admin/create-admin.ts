import * as path from "path";
import * as winston from "winston";
import { paramCase } from "param-case";
import { get } from "lodash";
import { plural } from "pluralize";
import { Entity, Role, AppInfo, Module } from "@amplication/code-gen-types";
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
import { createDotEnvModule } from "./create-dotenv";

const STATIC_MODULES_PATH = path.join(__dirname, "static");
const API_PATHNAME = "/api";

const validatePath = (adminPath: string) => adminPath.trim() || null;
const dynamicPathCreator = (adminPath: string) => {
  const baseDirectory = validatePath(adminPath) || BASE_DIRECTORY;
  const srcDirectory = `${baseDirectory}/src`;
  return {
    BASE: baseDirectory,
    SRC: srcDirectory,
    PUBLIC: `${baseDirectory}/public`,
    API: `${srcDirectory}/api`,
    AUTH: `${srcDirectory}/auth-provider`,
  };
};

/**
 * responsible of the Admin ui modules generation
 */
export async function createAdminModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  const directoryManager = dynamicPathCreator(
    get(appInfo, "settings.adminUISettings.adminUIPath", "")
  );
  logger.info(`Admin path: ${directoryManager.BASE}`);
  logger.info("Creating admin...");
  logger.info("Copying static modules...");
  const rawStaticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    directoryManager.BASE
  );
  const staticModules = updatePackageJSONs(
    rawStaticModules,
    directoryManager.BASE,
    {
      name: `@${paramCase(appInfo.name)}/admin`,
      version: appInfo.version,
    }
  );

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

  const publicFilesModules = await createPublicFiles(
    appInfo,
    directoryManager.PUBLIC
  );
  const entityToDirectory = createEntityToDirectory(
    entities,
    directoryManager.SRC
  );
  const dtoNameToPath = createDTONameToPath(dtos, directoryManager.API);
  const dtoModules = createDTOModules(dtos, dtoNameToPath);
  const enumRolesModule = createEnumRolesModule(roles, directoryManager.SRC);
  const rolesModule = createRolesModule(roles, directoryManager.SRC);
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
    entitiesComponents,
    directoryManager
  );
  const createdModules = [
    appModule,
    enumRolesModule,
    rolesModule,
    ...dtoModules,
    ...entityTitleComponentsModules,
    ...entityComponentsModules,
  ];
  const dotEnvModule = await createDotEnvModule(appInfo, directoryManager.BASE);

  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  return [
    ...staticModules,
    ...publicFilesModules,
    ...formattedModules,
    dotEnvModule,
  ];
}
