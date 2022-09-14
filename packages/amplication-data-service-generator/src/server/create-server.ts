import * as path from "path";
import winston from "winston";
import { paramCase } from "param-case";
import {
  Entity,
  Role,
  AppInfo,
  Module,
  DTOs,
  DSGResourceData,
} from "@amplication/code-gen-types";
import { readStaticModules } from "../read-static-modules";
import { formatCode, formatJson } from "../util/module";
import { createDTOModules } from "./resource/create-dtos";
import { createResourcesModules } from "./resource/create-resource";
import { createSwagger } from "./swagger/create-swagger";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { createGrantsModule } from "./create-grants";
import { createDotEnvModule } from "./create-dotenv";
import { createSeedModule } from "./seed/create-seed";
import DsgContext from "../dsg-context";
import { ENV_VARIABLES } from "./constants";
import { createAuthModules } from "./auth/createAuth";
import { createPackageJson } from "./package-json/create-package-json";
import { createMessageBroker } from "./message-broker/create-service-message-broker-modules";
import { createDockerComposeDBFile } from "./docker-compose/create-docker-compose-db";
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createServerModules(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  dtos: DTOs,
  userEntity: Entity,
  dSGResourceData: DSGResourceData,
  logger: winston.Logger
): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;

  logger.info(`Server path: ${serverDirectories.baseDirectory}`);
  logger.info("Creating server...");
  logger.info("Copying static modules...");
  const staticModules = await readStaticModules(
    STATIC_DIRECTORY,
    serverDirectories.baseDirectory
  );
  const packageJsonModule = await createPackageJson({
    update: {
      name: `@${paramCase(appInfo.name)}/server`,
      version: appInfo.version,
    },
    baseDirectory: serverDirectories.baseDirectory,
  });

  logger.info("Creating resources...");
  const dtoModules = createDTOModules(dtos, serverDirectories.srcDirectory);
  const resourcesModules = await createResourcesModules(
    appInfo,
    entities,
    dtos,
    logger
  );

  logger.info("Creating Auth module...");
  const authModules = await createAuthModules({
    srcDir: serverDirectories.srcDirectory,
  });

  logger.info("Creating application module...");
  const appModule = await createAppModule(
    resourcesModules,
    staticModules,
    serverDirectories.srcDirectory
  );

  logger.info("Creating swagger...");
  const swaggerModule = await createSwagger(
    appInfo,
    serverDirectories.srcDirectory
  );

  logger.info("Creating seed script...");
  const seedModule = await createSeedModule(
    userEntity,
    dtos,
    serverDirectories.scriptsDirectory,
    serverDirectories.srcDirectory
  );
  logger.info("Creating kakfa modules...");
  const kafkaModules = await createMessageBroker({
    serviceTopicsWithName: dSGResourceData.serviceTopics || [],
  });

  const createdModules = [
    ...resourcesModules,
    ...dtoModules,
    swaggerModule,
    appModule,
    seedModule,
    ...authModules,
    ...kafkaModules,
  ];

  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  const formattedJsonFiles = [...packageJsonModule].map((module) => ({
    ...module,
    code: formatJson(module.code),
  }));

  logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(
    entities,
    serverDirectories.baseDirectory
  );

  logger.info("Creating access control grants...");
  const grantsModule = createGrantsModule(
    entities,
    roles,
    serverDirectories.srcDirectory
  );
  const dotEnvModule = await createDotEnvModule({
    baseDirectory: serverDirectories.baseDirectory,
    envVariables: ENV_VARIABLES,
  });

  const dockerComposeFile = await createDockerComposeFile();
  const dockerComposeDBFile = await createDockerComposeDBFile();

  return [
    ...staticModules,
    ...formattedJsonFiles,
    ...formattedModules,
    prismaSchemaModule,
    grantsModule,
    ...dotEnvModule,
    ...dockerComposeFile,
    ...dockerComposeDBFile,
  ];
}
