import { Module, AppInfo } from "../types";
import { BASE_DIRECTORY } from "./constants";
import { isEmpty } from "lodash";
import { readCode } from "../util/module";
import { replacePlaceholdersInCode } from "../util/text-file-parser";
export const MODULE_PATH = `${BASE_DIRECTORY}/.env`;

const templatePath = require.resolve("./create-dotenv.template.env");

/**
 * Creates the .env file based on the given template with placeholder.
 * The function replaces any placeholder in a ${name} format based on the key in the appInfo.settings
 * @returns grants JSON module
 */
export async function createDotEnvModule(appInfo: AppInfo): Promise<Module> {
  const code = await readCode(templatePath);

  if (
    !isEmpty(appInfo.settings.dbName) &&
    !appInfo.settings.dbName.startsWith("/")
  ) {
    appInfo.settings.dbName = `/${appInfo.settings.dbName}`;
  }

  return {
    path: MODULE_PATH,
    code: replacePlaceholdersInCode(code, appInfo.settings),
  };
}
