import * as path from "path";
import normalize from "normalize-path";

import winston from "winston";

import { formatCode, Module } from "./util/module";
import { getEntityIdToName } from "./util/entity";
import { createResourcesModules } from "./resource/create-resource";
import { createSwagger } from "./swagger/create-swagger";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { defaultLogger } from "./logging";
import { Entity, Role, AppInfo } from "./types";
import { createGrantsModule } from "./create-grants";
import { createUserEntityIfNotExist } from "./user-entity";
import { createSeedModule } from "./seed/create-seed";
import { readStaticModules } from "./read-static-modules";
import { createAdminModules } from "./admin/create-admin";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createDataService(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  logger: winston.Logger = defaultLogger
): Promise<Module[]> {
  logger.info("Creating application...");
  const timer = logger.startTimer();
  const staticModules = await readStaticModules(STATIC_DIRECTORY, "", logger);
  const [normalizedEntities, userEntity] = createUserEntityIfNotExist(entities);

  const dynamicModules = await createDynamicModules(
    normalizedEntities,
    userEntity,
    roles,
    appInfo,
    staticModules,
    logger
  );

  timer.done({ message: "Application creation time" });

  const modules = [...staticModules, ...dynamicModules];

  /** @todo make module paths to always use Unix path separator */
  return modules.map((module) => ({
    ...module,
    path: normalize(module.path),
  }));
}

async function createDynamicModules(
  entities: Entity[],
  userEntity: Entity,
  roles: Role[],
  appInfo: AppInfo,
  staticModules: Module[],
  logger: winston.Logger
): Promise<Module[]> {
  const entityIdToName = getEntityIdToName(entities);

  logger.info("Creating resources...");
  const resourcesModules = await createResourcesModules(
    entities,
    entityIdToName,
    logger
  );

  logger.info("Creating application module...");
  const appModule = await createAppModule(resourcesModules, staticModules);

  logger.info("Creating swagger...");
  const swaggerModule = await createSwagger(appInfo);

  logger.info("Creating seed script...");
  const seedModule = await createSeedModule(userEntity);

  const createdModules = [
    ...resourcesModules,
    swaggerModule,
    appModule,
    seedModule,
  ];

  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));

  logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(
    entities,
    entityIdToName
  );

  logger.info("Creating access control grants...");
  const grantsModule = createGrantsModule(entities, roles);

  logger.info("Creating admin...");
  const adminModules = await createAdminModules(entities, logger);

  return [
    ...formattedModules,
    prismaSchemaModule,
    grantsModule,
    ...adminModules,
  ];
}
