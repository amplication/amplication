import * as path from "path";
import winston from "winston";
import { readStaticModules } from "./read-static-modules";
import { formatCode, Module } from "./util/module";
import { createDTOModules, DTOs } from "./resource/create-dtos";
import { createResourcesModules } from "./resource/create-resource";
import { createSwagger } from "./swagger/create-swagger";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { Entity, Role, AppInfo } from "./types";
import { createGrantsModule } from "./create-grants";
import { createSeedModule } from "./seed/create-seed";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createServerModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  entityIdToName: Record<string, string>,
  dtos: DTOs,
  userEntity: Entity,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Creating server...");
  const staticModules = await readStaticModules(STATIC_DIRECTORY, "", logger);
  logger.info("Creating resources...");
  const dtoModules = createDTOModules(dtos);
  const resourcesModules = await createResourcesModules(
    entities,
    entityIdToName,
    dtos,
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
    ...dtoModules,
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
  return [
    ...staticModules,
    ...formattedModules,
    prismaSchemaModule,
    grantsModule,
  ];
}
