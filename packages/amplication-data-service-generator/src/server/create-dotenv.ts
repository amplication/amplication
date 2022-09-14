import {
  Module,
  EventNames,
  CreateServerDotEnvParams,
  VariableDictionary,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import { isEmpty } from "lodash";
import pluginWrapper from "../plugin-wrapper";
import { readCode } from "../util/module";
import { replacePlaceholdersInCode } from "../util/text-file-parser";

const templatePath = require.resolve("./create-dotenv.template.env");

export function createDotEnvModule(
  eventParams: CreateServerDotEnvParams["before"]
): Promise<Module[]> {
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
  envVariables,
}: CreateServerDotEnvParams["before"]): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { appInfo } = context;

  const code = await readCode(templatePath);
  const formattedAdditionalVariables = convertToKeyValueSting(envVariables);
  const codeWithAdditionalVariables = appendAdditionalVariables(
    code,
    formattedAdditionalVariables
  );

  if (
    !isEmpty(appInfo.settings.dbName) &&
    !appInfo.settings.dbName.startsWith("/")
  ) {
    appInfo.settings.dbName = `/${appInfo.settings.dbName}`;
  }

  return [
    {
      path: `${baseDirectory}/.env`,
      code: replacePlaceholdersInCode(
        codeWithAdditionalVariables,
        appInfo.settings
      ),
    },
  ];
}

function convertToKeyValueSting(arr: VariableDictionary): string {
  if (!arr.length) return "";
  return arr
    .map((item) =>
      Object.entries(item).map(([key, value]) => `${key}=${value}`)
    )
    .join("\n");
}

function appendAdditionalVariables(file: string, variables: string): string {
  if (!variables.trim()) return file;
  if (!file.trim()) return file.concat(variables);
  return file.concat(`\n${variables}`);
}
