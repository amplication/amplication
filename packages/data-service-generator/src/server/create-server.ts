import * as path from "path";
import {
  Module,
  EventNames,
  CreateServerParams,
} from "@amplication/code-gen-types";
import { readStaticModules } from "../utils/read-static-modules";
import { formatCode, formatJson } from "@amplication/code-gen-utils";
import { createDTOModules, createDTOs } from "./resource/create-dtos";
import { createResourcesModules } from "./resource/create-resource";
import { createSwagger } from "./swagger/create-swagger";
import { createAppModule } from "./app-module/create-app-module";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { createDotEnvModule } from "./create-dotenv";
import { createSeed } from "./seed/create-seed";
import DsgContext from "../dsg-context";
import { ENV_VARIABLES } from "./constants";
import { createServerPackageJson } from "./package-json/create-package-json";
import { createMessageBroker } from "./message-broker/create-service-message-broker-modules";
import { createDockerComposeDBFile } from "./docker-compose/create-docker-compose-db";
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";
import pluginWrapper from "../plugin-wrapper";
import { createLog } from "../create-log";
import { createAuthModules } from "./auth/create-auth";
import { createGitIgnore } from "./gitignore/create-gitignore";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export function createServer(): Promise<Module[]> {
  return pluginWrapper(createServerInternal, EventNames.CreateServer, {});
}

async function createServerInternal(
  eventParams: CreateServerParams
): Promise<Module[]> {
  const { serverDirectories, entities, logger } = DsgContext.getInstance;

  const context = DsgContext.getInstance;

  await createLog({ level: "info", message: "Creating DTOs..." });
  logger.info("Creating DTOs...");

  const dtos = await createDTOs(context.entities);
  context.DTOs = dtos;

  const { GIT_REF_NAME: gitRefName, GIT_SHA: gitSha } = process.env;

  logger.info(`Running DSG Version: ${gitRefName} <${gitSha}>`);
  await createLog({
    level: "info",
    message: `Running DSG Version: ${gitRefName} <${gitSha?.substring(0, 6)}>`,
  });

  await createLog({
    level: "info",
    message: `Server path: ${serverDirectories.baseDirectory}`,
  });
  logger.info(`Server path: ${serverDirectories.baseDirectory}`);
  await createLog({ level: "info", message: "Creating server..." });
  logger.info("Creating server...");
  await createLog({ level: "info", message: "Copying static modules..." });
  logger.info("Copying static modules...");

  const staticModules = await readStaticModules(
    STATIC_DIRECTORY,
    serverDirectories.baseDirectory
  );

  await createLog({ level: "info", message: "Creating gitignore..." });
  logger.info("Creating gitignore...");
  const gitIgnore = await createGitIgnore();

  const packageJsonModule = await createServerPackageJson();

  await createLog({ level: "info", message: "Creating resources..." });
  logger.info("Creating resources...");
  const dtoModules = await createDTOModules(dtos);
  const resourcesModules = await createResourcesModules(entities, logger);

  await createLog({ level: "info", message: "Creating Auth module..." });
  logger.info("Creating Auth module...");
  const authModules = await createAuthModules();

  await createLog({ level: "info", message: "Creating swagger..." });
  logger.info("Creating swagger...");
  const swagger = await createSwagger();

  await createLog({ level: "info", message: "Creating seed script..." });
  logger.info("Creating seed script...");
  const seedModule = await createSeed();

  await createLog({
    level: "info",
    message: "Creating Message broker modules...",
  });
  logger.info("Creating Message broker modules...");
  const messageBrokerModules = await createMessageBroker({});

  await createLog({ level: "info", message: "Creating application module..." });
  logger.info("Creating application module...");
  const appModule = await createAppModule([
    ...resourcesModules,
    ...staticModules,
  ]);

  const createdModules = [
    ...resourcesModules,
    ...dtoModules,
    ...swagger,
    ...appModule,
    ...seedModule,
    ...authModules,
    ...messageBrokerModules,
  ];

  await createLog({ level: "info", message: "Formatting code..." });
  logger.info("Formatting code...");
  const formattedModules = createdModules.map((module) => ({
    ...module,
    code: formatCode(module.code),
  }));
  const formattedJsonFiles = [...packageJsonModule].map((module) => ({
    ...module,
    code: formatJson(module.code),
  }));

  await createLog({ level: "info", message: "Creating Prisma schema..." });
  logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(entities);

  await createLog({
    level: "info",
    message: "Creating Dot Env...",
  });

  const dotEnvModule = await createDotEnvModule({
    envVariables: ENV_VARIABLES,
  });

  const dockerComposeFile = await createDockerComposeFile();
  const dockerComposeDBFile = await createDockerComposeDBFile();

  return [
    ...staticModules,
    ...gitIgnore,
    ...formattedJsonFiles,
    ...formattedModules,
    ...prismaSchemaModule,
    ...dotEnvModule,
    ...dockerComposeFile,
    ...dockerComposeDBFile,
  ];
}
