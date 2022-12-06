import * as path from "path";
import {
  Module,
  EventNames,
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
import { createSeed } from "./seed/create-seed";
import DsgContext from "../dsg-context";
import { ENV_VARIABLES } from "./constants";
import { createAuthModules } from "./auth/createAuth";
import { createServerPackageJson } from "./package-json/create-package-json";
import { createMessageBroker } from "./message-broker/create-service-message-broker-modules";
import { createDockerComposeDBFile } from "./docker-compose/create-docker-compose-db";
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";
import pluginWrapper from "../plugin-wrapper";
import { createLog } from "../create-log";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export function createServer(): Promise<Module[]> {
  return pluginWrapper(createServerInternal, EventNames.CreateServer, {});
}

async function createServerInternal(
  eventParams: CreateServerParams
): Promise<Module[]> {
  const {
    serverDirectories,
    roles,
    entities,
    DTOs: dtos,
    logger,
  } = DsgContext.getInstance;

  const dsgVersion = (await import("../../package.json")).version;
  logger.info(`Running DSG Version: ${dsgVersion}`);
  await createLog({
    level: "info",
    message: `Running DSG Version: ${dsgVersion}`,
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
  const packageJsonModule = await createServerPackageJson();

  await createLog({ level: "info", message: "Creating resources..." });
  logger.info("Creating resources...");
  const dtoModules = createDTOModules(dtos);
  const resourcesModules = await createResourcesModules(entities, logger);

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
  const appModule = await createAppModule({
    modulesFiles: [...resourcesModules, ...staticModules],
  });

  const createdModules = [
    ...resourcesModules,
    ...dtoModules,
    ...swagger,
    ...appModule,
    ...seedModule,
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
    message: "Creating access control grants...",
  });
  logger.info("Creating access control grants...");
  const grantsModule = createGrantsModule(entities, roles);
  const dotEnvModule = await createDotEnvModule({
    //todo::
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
