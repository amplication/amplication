import winston from "winston";
import { Module, AppGenerationConfig } from "./types";
import { version } from "./version";
import { formatJson } from "./util/module";

const AMP_CONFIG_FILE_NAME = "ampconfig.json";

export async function createRootModules(
  logger: winston.Logger
): Promise<Module[]> {
  return createAmplicationConfigurationFile(logger);
}

async function createAmplicationConfigurationFile(
  logger: winston.Logger
): Promise<Module[]> {
  logger.info(`Creating Amplication configuration file ${version}...`);

  const config: AppGenerationConfig = {
    dataServiceGeneratorVersion: version,
  };

  return [
    {
      path: `${AMP_CONFIG_FILE_NAME}`,
      code: formatJson(JSON.stringify(config)),
    },
  ];
}
