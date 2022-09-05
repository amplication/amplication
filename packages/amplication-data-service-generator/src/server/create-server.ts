import * as path from "path";
import winston from "winston";
import { paramCase } from "param-case";
import {
  Entity,
  Role,
  AppInfo,
  Module,
  DTOs,
} from "@amplication/code-gen-types";
import { readStaticModules } from "../read-static-modules";
import { formatCode } from "../util/module";
import { updatePackageJSONs } from "../update-package-jsons";
import { createDTOModules } from "./resource/create-dtos";
import { createResourcesModules } from "./resource/create-resource";
import { createSwagger } from "./swagger/create-swagger";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { createGrantsModule } from "./create-grants";
import { createDotEnvModule } from "./create-dotenv";
import { createSeedModule } from "./seed/create-seed";
import { BASE_DIRECTORY } from "./constants";
import { createAuthModules } from "./auth/createAuth";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

const validatePath = (serverPath: string) => serverPath.trim() || null;

const dynamicPathCreator = (serverPath: string) => {
  const baseDirectory = validatePath(serverPath) || BASE_DIRECTORY;
  const srcDirectory = `${baseDirectory}/src`;
  return {
    BASE: baseDirectory,
    SRC: srcDirectory,
    SCRIPTS: `${baseDirectory}/scripts`,
    AUTH: `${baseDirectory}/auth`,
  };
};

export async function createServerModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  userEntity: Entity,
  logger: winston.Logger
): Promise<Module[]> {
  const directoryManager = dynamicPathCreator(
    appInfo?.settings?.serverSettings?.serverPath || ""
  );

  logger.info(`Server path: ${directoryManager.BASE}`);
  logger.info("Creating server...");
  logger.info("Copying static modules...");
  const rawStaticModules = await readStaticModules(
    STATIC_DIRECTORY,
    directoryManager.BASE
  );
  const staticModules = updatePackageJSONs(
    rawStaticModules,
    directoryManager.BASE,
    {
      name: `@${paramCase(appInfo.name)}/server`,
      version: appInfo.version,
    }
  );

  logger.info("Creating resources...");
  const dtoModules = createDTOModules(dtos, directoryManager.SRC);
  const resourcesModules = await createResourcesModules(
    appInfo,
    entities,
    dtos,
    logger,
    directoryManager.SRC
  );

  logger.info("Creating Auth module...");
  const authModules = await createAuthModules({ srcDir: directoryManager.SRC });

  logger.info("Creating application module...");
  const appModule = await createAppModule(
    resourcesModules,
    staticModules,
    directoryManager.SRC
  );

  logger.info("Creating swagger...");
  const swaggerModule = await createSwagger(appInfo, directoryManager.SRC);

  logger.info("Creating seed script...");
  const seedModule = await createSeedModule(
    userEntity,
    dtos,
    directoryManager.SCRIPTS,
    directoryManager.SRC
  );

  const createdModules = [
    ...resourcesModules,
    ...dtoModules,
    swaggerModule,
    appModule,
    seedModule,
    ...authModules,
  ];

  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));

  logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(
    entities,
    directoryManager.BASE
  );

  logger.info("Creating access control grants...");
  const grantsModule = createGrantsModule(
    entities,
    roles,
    directoryManager.SRC
  );
  const dotEnvModule = await createDotEnvModule(appInfo, directoryManager.BASE);

  return [
    ...staticModules,
    ...formattedModules,
    prismaSchemaModule,
    grantsModule,
    dotEnvModule,
  ];
}
