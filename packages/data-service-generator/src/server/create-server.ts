import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { readStaticModules } from "../utils/read-static-modules";
import { createAppModule } from "./app-module/create-app-module";
import { createAuthModules } from "./auth/create-auth";
import { connectMicroservices } from "./connect-microservices/connect-microservices";
import { ENV_VARIABLES } from "./constants";
import { createDotEnvModule } from "./create-dotenv";
import { createMainFile } from "./create-main/create-main-file";
import { createTypesRelatedFiles } from "./create-types-related-files/create-types-related-files";
import { createDockerComposeFile } from "./docker-compose/create-docker-compose";
import { createDockerComposeDevFile } from "./docker-compose/create-docker-compose-dev";
import { createGitIgnore } from "./gitignore/create-gitignore";
import { createMessageBroker } from "./message-broker/create-service-message-broker-modules";
import { createServerPackageJson } from "./package-json/create-package-json";
import { createPrismaSchemaModule } from "./prisma/create-prisma-schema-module";
import { createDTOModules } from "./resource/create-dtos";
import { createResourcesModules } from "./resource/create-resource";
import { createSecretsManager } from "./secrets-manager/create-secrets-manager";
import { createSeed } from "./seed/create-seed";
import { createSwagger } from "./swagger/create-swagger";
import {
  EventNames,
  CreateServerParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { formatCode } from "@amplication/code-gen-utils";
import * as path from "path";

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

  await context.logger.info("Creating server DTOs...");
  const dtoModules = await createDTOModules(context.DTOs);

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

  await context.logger.info("Creating SecretsManager...");
  const secretsManagerModule = await createSecretsManager({
    secretsNameKey: [],
  });

  await context.logger.info("Creating application module...");

  const appModuleInputModules = new ModuleMap(context.logger);
  await appModuleInputModules.mergeMany([
    resourcesModules,
    staticModules,
    secretsManagerModule,
  ]);
  const appModule = await createAppModule(appModuleInputModules);

  await context.logger.info("Formatting resources code...");
  await resourcesModules.replaceModulesCode((path, code) =>
    formatCode(path, code)
  );
  await context.logger.info("Formatting DTOs code...");
  await dtoModules.replaceModulesCode((path, code) => formatCode(path, code));
  await context.logger.info("Formatting swagger code...");
  await swagger.replaceModulesCode((path, code) => formatCode(path, code));
  await context.logger.info("Formatting application module code...");
  await appModule.replaceModulesCode((path, code) => formatCode(path, code));
  await context.logger.info("Formatting seed code...");
  await seedModule.replaceModulesCode((path, code) => formatCode(path, code));
  await context.logger.info("Formatting auth module code...");
  await authModules.replaceModulesCode((path, code) => formatCode(path, code));
  await context.logger.info("Formatting message broker code...");
  await messageBrokerModules.replaceModulesCode((path, code) =>
    formatCode(path, code)
  );
  await context.logger.info("Formatting package.json code...");
  await packageJsonModule.replaceModulesCode((path, code) =>
    formatCode(path, code)
  );

  const typesRelatedFiles = await createTypesRelatedFiles();
  const mainFile = await createMainFile();
  await context.logger.info("Creating Prisma schema...");
  const prismaSchemaModule = await createPrismaSchemaModule(entities);

  await context.logger.info("Creating Dotenv...");
  const dotEnvModule = await createDotEnvModule({
    envVariables: ENV_VARIABLES,
  });

  await context.logger.info("Creating connectMicroservices function...");
  const connectMicroservicesModule = await connectMicroservices();

  await context.logger.info("Creating Docker Compose configurations...");
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
    secretsManagerModule,
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
