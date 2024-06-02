import {
  CreateServerDotEnvParams,
  EventNames,
  Module,
  ModuleMap,
  VariableDictionary,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";
import pluginWrapper from "../plugin-wrapper";
import { replacePlaceholdersInCode } from "../utils/text-file-parser";
import { sortAlphabetically } from "../utils/dotenv";

export function createDotEnvModule(
  eventParams: CreateServerDotEnvParams
): ModuleMap {
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
}: CreateServerDotEnvParams): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  const { appInfo, serverDirectories } = context;
  const envVariablesWithoutDuplicateKeys = removeDuplicateKeys(envVariables);
  const envVariablesSorted = sortAlphabetically(
    envVariablesWithoutDuplicateKeys
  );
  const codeWithEnvVariables = convertToKeyValueSting(envVariablesSorted);

  const serviceSettingsDic: { [key: string]: any } = appInfo.settings;

  const module: Module = {
    path: `${serverDirectories.baseDirectory}/.env`,
    code: replacePlaceholdersInCode(codeWithEnvVariables, serviceSettingsDic),
  };
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}

function convertToKeyValueSting(arr: VariableDictionary): string {
  if (!arr.length) return "";
  return arr
    .map((item) =>
      Object.entries(item).map(([key, value]) => `${key}=${value}`)
    )
    .join("\n");
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
