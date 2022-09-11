import { Module, AppInfo } from "@amplication/code-gen-types";
import { isEmpty } from "lodash";
import { readCode } from "../../util/module";
import { replacePlaceholdersInCode } from "../../util/text-file-parser";

const templatePath = require.resolve("./create-dotenv.template.env");

const createDotEnvMessageBrokerVars = (resourceName: string): string => {
  const vars = {
    KAFKA_BROKERS: "localhost:9092",
    KAFKA_ENABLE_SSL: "false",
    KAFKA_CLIENT_ID: resourceName,
    KAFKA_GROUP_ID: resourceName,
  };
  return Object.entries(vars).reduce((existingString, [key, value]) => {
    return `${existingString}\n${key}=${value}`;
  }, "");
};

/**
 * Creates the .env file based on the given template with placeholder.
 * The function replaces any placeholder in a ${name} format based on the key in the appInfo.settings
 * @returns grants JSON module
 */
export async function createDotEnvModule(
  appInfo: AppInfo,
  baseDirectory: string,
  isConnectedToMessageBroker: boolean
): Promise<Module> {
  const code =
    (await readCode(templatePath)) +
    (isConnectedToMessageBroker
      ? createDotEnvMessageBrokerVars(appInfo.name)
      : "");

  if (
    !isEmpty(appInfo.settings.dbName) &&
    !appInfo.settings.dbName.startsWith("/")
  ) {
    appInfo.settings.dbName = `/${appInfo.settings.dbName}`;
  }

  return {
    path: `${baseDirectory}/.env`,
    code: replacePlaceholdersInCode(code, appInfo.settings),
  };
}
