import * as path from "path";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Module, EventNames } from "@amplication/code-gen-types";
import { formatCode } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { updatePackageJSONs } from "../update-package-jsons";
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
import { createEntityToDirectory } from "./create-entity-to-directory";
import { createEnumRolesModule } from "./create-enum-roles";
import { createRolesModule } from "./create-roles-module";
import { createDotEnvModule } from "./create-dotenv";
import pluginWrapper from "../plugin-wrapper";
import DsgContext from "../dsg-context";

const STATIC_MODULES_PATH = path.join(__dirname, "static");
const API_PATHNAME = "/api";
/**
 * responsible of the Admin ui modules generation
 */
export function createAdminModules(): Promise<Module[]> {
  return pluginWrapper(
    createAdminModulesInternal,
    EventNames.CreateAdminModules,
    {}
  );
}

async function createAdminModulesInternal(): Promise<Module[]> {
  const {
    appInfo,
    logger,
    entities,
    roles,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DTOs,
    clientDirectories,
  } = DsgContext.getInstance;

  logger.info(`Admin path: ${clientDirectories.baseDirectory}`);
  logger.info("Creating admin...");
  logger.info("Copying static modules...");
  const rawStaticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    clientDirectories.baseDirectory
  );
  const staticModules = updatePackageJSONs(
    rawStaticModules,
    clientDirectories.baseDirectory,
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
    clientDirectories.publicDirectory
  );
  const entityToDirectory = createEntityToDirectory(
    entities,
    clientDirectories.srcDirectory
  );
  const dtoNameToPath = createDTONameToPath(
    DTOs,
    clientDirectories.apiDirectory
  );
  const dtoModules = createDTOModules(DTOs, dtoNameToPath);
  const enumRolesModule = createEnumRolesModule(
    roles,
    clientDirectories.srcDirectory
  );
  const rolesModule = createRolesModule(roles, clientDirectories.srcDirectory);
  // Create title components first so they are available when creating entity modules
  const entityToTitleComponent = await createEntityTitleComponents(
    entities,
    DTOs,
    entityToDirectory,
    entityToResource,
    dtoNameToPath
  );

  const entityTitleComponentsModules = await createEntityTitleComponentsModules(
    entityToTitleComponent
  );

  const entitiesComponents = await createEntitiesComponents(
    entities,
    DTOs,
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
  const dotEnvModule = await createDotEnvModule(
    appInfo,
    clientDirectories.baseDirectory
  );

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
