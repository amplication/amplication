import * as path from "path";
import {
  EventNames,
  CreateServerParams,
  ModuleMap,
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
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";
import pluginWrapper from "../plugin-wrapper";
import { createAuthModules } from "./auth/create-auth";
import { createGitIgnore } from "./gitignore/create-gitignore";
import { createDockerComposeDevFile } from "./docker-compose/create-docker-compose-dev";
import { createTypesRelatedFiles } from "./create-types-related-files/create-types-related-files";
import { createMainFile } from "./create-main/create-main-file";
import { connectMicroservices } from "./connect-microservices/connect-microservices";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export function createServer(): Promise<ModuleMap> {
  return pluginWrapper(createServerInternal, EventNames.CreateServer, {});
}

async function createServerInternal(
  eventParams: CreateServerParams
): Promise<ModuleMap> {
  const { serverDirectories, entities } = DsgContext.getInstance;

  const context = DsgContext.getInstance;

  await context.logger.info(`Server path: ${serverDirectories.baseDirectory}`);
  await context.logger.info("Creating server...");

  await context.logger.info("Copying static modules...");
  const staticModules = await readStaticModules(
    STATIC_DIRECTORY,
    serverDirectories.baseDirectory
  );

  await context.logger.info("Creating gitignore...");
  const gitIgnore = await createGitIgnore();

  await context.logger.info("Creating package.json...");
  const packageJsonModule = await createServerPackageJson();

  await context.logger.info("Creating DTOs...");
  const dtos = await createDTOs(context.entities);
  context.DTOs = dtos;
  const dtoModules = await createDTOModules(dtos);

  await context.logger.info("Creating resources...");
  const resourcesModules = await createResourcesModules(entities);

  await context.logger.info("Creating auth module...");
  const authModules = await createAuthModules();

  await context.logger.info("Creating swagger...");
  const swagger = await createSwagger();

  await context.logger.info("Creating seed script...");
  const seedModule = await createSeed();

  await context.logger.info("Creating message broker...");
  const messageBrokerModules = await createMessageBroker({});

  await context.logger.info("Creating application module...");

  const appModuleInputModules = new ModuleMap(context.logger);
  await appModuleInputModules.mergeMany([resourcesModules, staticModules]);
  const appModule = await createAppModule(appModuleInputModules);

  await context.logger.info("Formatting resources code...");
  await resourcesModules.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting dtos code...");
  await dtoModules.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting swagger code...");
  await swagger.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting application module code...");
  await appModule.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting seed code...");
  await seedModule.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting auth module code...");
  await authModules.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting message broker code...");
  await messageBrokerModules.replaceModulesCode((code) => formatCode(code));
  await context.logger.info("Formatting package.json code...");
  await packageJsonModule.replaceModulesCode((code) => formatJson(code));

  const typesRelatedFiles = await createTypesRelatedFiles();
  const mainFile = await createMainFile();
  await context.logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(entities);

  await context.logger.info("Creating Dot Env...");
  const dotEnvModule = await createDotEnvModule({
    envVariables: ENV_VARIABLES,
  });

  await context.logger.info("Creating connectMicroservices function...");
  const connectMicroservicesModule = await connectMicroservices();

  await context.logger.info("Creating Docker compose configurations...");
  const dockerComposeFile = await createDockerComposeFile();
  const dockerComposeDevFile = await createDockerComposeDevFile();

  await context.logger.info("Finalizing server creation...");
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.mergeMany([
    staticModules,
    gitIgnore,
    packageJsonModule,
    resourcesModules,
    dtoModules,
    swagger,
    appModule,
    seedModule,
    authModules,
    messageBrokerModules,
    prismaSchemaModule,
    dotEnvModule,
    dockerComposeFile,
    dockerComposeDevFile,
    typesRelatedFiles,
    mainFile,
    connectMicroservicesModule,
  ]);
  return moduleMap;
}
