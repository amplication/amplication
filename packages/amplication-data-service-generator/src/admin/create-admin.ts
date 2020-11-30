import * as path from "path";
import * as winston from "winston";
import { camelCase } from "camel-case";
import { Entity } from "../types";
import { formatCode, Module } from "../util/module";
import { readStaticModules } from "../read-static-modules";
import { DTOs } from "../resource/create-dtos";
import { createDTOModulePath } from "../resource/dto/create-dto-module";
import { createNavigationModule } from "./navigation/create-navigation";
import { createAppModule } from "./app/create-app";
import { createDTOModules } from "./create-dto-modules";
import { createEntitiesComponents } from "./entity/create-entities-components";
import { createEntityComponentsModules } from "./entity/create-entity-components-modules";

const STATIC_MODULES_PATH = path.join(__dirname, "static");

export async function createAdminModules(
  entities: Entity[],
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  const staticModules = await readStaticModules(
    STATIC_MODULES_PATH,
    "admin",
    logger
  );
  const navigationModule = await createNavigationModule(entities);
  const entityToDirectory = Object.fromEntries(
    entities.map((entity) => [
      entity.name,
      `admin/src/${camelCase(entity.name)}`,
    ])
  );
  const dtoNameToPath = Object.fromEntries(
    Object.entries(dtos).flatMap(([entityName, entityDTOs]) =>
      Object.values(entityDTOs).map((dto) => [
        dto.id.name,
        createDTOModulePath(entityToDirectory[entityName], dto.id.name),
      ])
    )
  );
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
  return [...staticModules, ...formattedModules];
}
