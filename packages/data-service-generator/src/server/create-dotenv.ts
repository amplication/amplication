import {
  CreateServerDotEnvParams,
  EventNames,
  Module,
  VariableDictionary,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { replacePlaceholdersInCode } from "../utils/text-file-parser";

export function createDotEnvModule(
  eventParams: CreateServerDotEnvParams
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
  envVariables,
}: CreateServerDotEnvParams): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { appInfo, serverDirectories } = context;
  const envVariablesWithoutDuplicateKeys = removeDuplicateKeys(envVariables);
  const formattedAdditionalVariables = convertToKeyValueSting(
    envVariablesWithoutDuplicateKeys
  );
  const codeWithAdditionalVariables = appendAdditionalVariables(
    "",
    formattedAdditionalVariables
  );
  const serviceSettingsDic: { [key: string]: any } = appInfo.settings;

  return [
    {
      path: `${serverDirectories.baseDirectory}/.env`,
      code: replacePlaceholdersInCode(
        codeWithAdditionalVariables,
        serviceSettingsDic
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

function removeDuplicateKeys(arr: VariableDictionary): VariableDictionary {
  const variablesMap = new Map();
  arr.forEach((item) => {
    const [currentKey] = Object.keys(item);
    const [currentValue] = Object.values(item);
    variablesMap.set(currentKey, currentValue);
  });
  return Array.from(variablesMap, ([key, value]) => ({ [key]: value }));
}
