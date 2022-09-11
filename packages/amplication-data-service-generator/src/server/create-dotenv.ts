import {
  Module,
  EventNames,
  CreateServerDotEnvParams,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { isEmpty } from "lodash";
import pluginWrapper from "../plugin-wrapper";
import { readCode } from "../util/module";
import { replacePlaceholdersInCode } from "../util/text-file-parser";

const templatePath = require.resolve("./create-dotenv.template.env");

export function createDotEnvModule(
  eventParams: CreateServerDotEnvParams["before"]
): Module[] {
  return pluginWrapper(
    createDotEnvModuleInternal,
    EventNames.CreateServerDotEnv,
    eventParams
  );
}

/**
 * Creates the .env file based on the given template with placeholder.
 * The function replaces any placeholder in a ${name} format based on the key in the appInfo.settings
 * @returns grants JSON module
 */
export async function createDotEnvModuleInternal({
  baseDirectory,
}: CreateServerDotEnvParams["before"]): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { appInfo } = context;

  const code = await readCode(templatePath);

  if (
    !isEmpty(appInfo.settings.dbName) &&
    !appInfo.settings.dbName.startsWith("/")
  ) {
    appInfo.settings.dbName = `/${appInfo.settings.dbName}`;
  }

  return [
    {
      path: `${baseDirectory}/.env`,
      code: replacePlaceholdersInCode(code, appInfo.settings),
    },
  ];
}
