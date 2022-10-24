import * as path from "path";
import { paramCase } from "param-case";
import {
  Module,
  EventNames,
  Entity,
  CreateServerParams,
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
import { createServerPackageJson } from "./package-json/create-package-json";
import { createMessageBroker } from "./message-broker/create-service-message-broker-modules";
import { createDockerComposeDBFile } from "./docker-compose/create-docker-compose-db";
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";
import pluginWrapper from "../plugin-wrapper";
import { USER_ENTITY_NAME } from "./user-entity";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export function createServer(): Promise<Module[]> {
  return pluginWrapper(createServerInternal, EventNames.CreateServer, {});
}

async function createServerInternal(
  eventParams: CreateServerParams
): Promise<Module[]> {
  const {
    serverDirectories,
    appInfo,
    roles,
    entities,
    DTOs: dtos,
    logger,
  } = DsgContext.getInstance;
  logger.info(`Server path: ${serverDirectories.baseDirectory}`);
  logger.info("Creating server...");
  logger.info("Copying static modules...");

  const staticModules = await readStaticModules(
    STATIC_DIRECTORY,
    serverDirectories.baseDirectory
  );
  const packageJsonModule = await createServerPackageJson({
    updateProperties: [
      {
        name: `@${paramCase(appInfo.name)}/server`,
        version: appInfo.version,
      },
    ],
  });

  logger.info("Creating resources...");
  const dtoModules = createDTOModules(dtos);
  const resourcesModules = await createResourcesModules(entities, logger);

  logger.info("Creating Auth module...");
  const authModules = await createAuthModules();

  logger.info("Creating swagger...");
  const swaggerModule = await createSwagger();

  const userEntity = entities.find(
    (entity) => entity.name === USER_ENTITY_NAME
  );
  logger.info("Creating seed script...");
  const seedModule = await createSeedModule(userEntity as Entity);

  logger.info("Creating Message broker modules...");
  const messageBrokerModules = await createMessageBroker({});

  logger.info("Creating application module...");
  const appModule = await createAppModule({
    modulesFiles: [...resourcesModules, ...staticModules],
  });

  const createdModules = [
    ...resourcesModules,
    ...dtoModules,
    swaggerModule,
    ...appModule,
    seedModule,
    ...authModules,
    ...messageBrokerModules,
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
  const prismaSchemaModule = await createPrismaSchemaModule(entities);

  logger.info("Creating access control grants...");
  const grantsModule = createGrantsModule(entities, roles);
  const dotEnvModule = await createDotEnvModule({
    envVariables: ENV_VARIABLES,
  });

  const dockerComposeFile = await createDockerComposeFile();
  const dockerComposeDBFile = await createDockerComposeDBFile();

  return [
    ...staticModules,
    ...formattedJsonFiles,
    ...formattedModules,
    ...prismaSchemaModule,
    grantsModule,
    ...dotEnvModule,
    ...dockerComposeFile,
    ...dockerComposeDBFile,
  ];
}
