import winston from "winston";
import { Module } from "./types";
import { version } from "./version";
import { formatJson } from "./util/module";

const AMP_CONFIG_FILE_NAME = "ampconfig.json";
const AMP_CONFIG_DSG_VERSION_PARAM = "data-service-generator-version";

export async function createRootModules(
  logger: winston.Logger
): Promise<Module[]> {
  return createAmplicationConfigurationFile(logger);
}

async function createAmplicationConfigurationFile(
  logger: winston.Logger
): Promise<Module[]> {
  logger.info(`Creating Amplication configuration file ${version}...`);
  return [
    {
      path: `${AMP_CONFIG_FILE_NAME}`,
      code: formatJson(`{
      "${AMP_CONFIG_DSG_VERSION_PARAM}": "${version}"
    }`),
    },
  ];
}
