import * as path from "path";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { EventNames, ModuleMap } from "@amplication/code-gen-types";
import { formatCode } from "@amplication/code-gen-utils";
import { readStaticModules } from "../utils/read-static-modules";
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
import { createAdminUIPackageJson } from "./package-json/create-package-json";
import { createGitIgnore } from "./gitignore/create-gitignore";
import { createTypesRelatedFiles } from "./create-types-related-files/create-types-related-files";

const STATIC_MODULES_PATH = path.join(__dirname, "static");
const API_PATHNAME = "/api";
/**
 * responsible of the Admin ui modules generation
 */
export function createAdminModules(): Promise<ModuleMap> {
  return pluginWrapper(
    createAdminModulesInternal,
    EventNames.CreateAdminUI,
    {}
  );
}

async function createAdminModulesInternal(): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  const { entities, roles, clientDirectories, logger } = context;

  await logger.info("Creating admin...");
  await logger.info(`Admin path: ${clientDirectories.baseDirectory}`);

  await context.logger.info("Copying static modules...");
  const staticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    clientDirectories.baseDirectory
  );

  await context.logger.info("Creating gitignore...");
  const gitIgnore = await createGitIgnore();

  await context.logger.info("Creating package.json...");
  const packageJson = await createAdminUIPackageJson();

  /**@todo: add code to auto import static DTOs from /server/static/src/util and strip the decorators
   * currently the files were manually copied to /admin/static/src/util
   */

  const entityToResource = Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `${API_PATHNAME}/${paramCase(plural(entity.name))}`,
    ])
  );
  const entityNameToEntity = Object.fromEntries(
    entities.map((entity) => [entity.name, entity])
  );

  await context.logger.info("Creating public files...");
  const publicFilesModules = await createPublicFiles();
  await context.logger.info("Creating Admin UI DTOs...");
  const dtoNameToPath = createDTONameToPath(context.DTOs);
  const dtoModuleMap = await createDTOModules(context.DTOs, dtoNameToPath);
  const enumRolesModule = createEnumRolesModule(roles);
  const rolesModule = createRolesModule(roles, clientDirectories.srcDirectory);

  // Create title components first so they are available when creating entity modules
  await context.logger.info("Creating entities components...");
  const entityToDirectory = createEntityToDirectory(entities);
  const entityToTitleComponent = await createEntityTitleComponents(
    entities,
    entityToDirectory,
    entityToResource,
    dtoNameToPath
  );

  const entityTitleComponentsModules = await createEntityTitleComponentsModules(
    entityToTitleComponent
  );

  const entitiesComponents = await createEntitiesComponents(
    entities,
    entityToDirectory,
    entityToTitleComponent,
    entityNameToEntity
  );
  const entityComponentsModules = await createEntityComponentsModules(
    entitiesComponents
  );

  await context.logger.info("Creating application module...");
  const appModuleMap = await createAppModule(entitiesComponents);

  await context.logger.info("Creating Dotenv...");
  const dotEnvModuleMap = await createDotEnvModule();

  await context.logger.info("Formatting code...");
  const tsModules = new ModuleMap(context.logger);
  await tsModules.set(enumRolesModule);
  await tsModules.set(rolesModule);
  await tsModules.mergeMany([
    appModuleMap,
    dtoModuleMap,
    entityTitleComponentsModules,
    entityComponentsModules,
  ]);
  await tsModules.replaceModulesCode((path, code) => formatCode(path, code));
  const typesRelatedFiles = await createTypesRelatedFiles();
  await context.logger.info("Finalizing admin creation...");

  const allModules = new ModuleMap(context.logger);
  await allModules.mergeMany([
    staticModules,
    typesRelatedFiles,
    gitIgnore,
    packageJson,
    dotEnvModuleMap,
    publicFilesModules,
    tsModules,
  ]);

  return allModules;
}
