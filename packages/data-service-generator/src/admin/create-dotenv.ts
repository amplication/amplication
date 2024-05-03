import {
  CreateAdminDotEnvParams,
  EventNames,
  Module,
  ModuleMap,
  VariableDictionary,
} from "@amplication/code-gen-types";
import { readCode } from "@amplication/code-gen-utils";
import { replacePlaceholdersInCode } from "../utils/text-file-parser";
import pluginWrapper from "../plugin-wrapper";
import DsgContext from "../dsg-context";
import { extractVariablesFromCode, sortAlphabetically } from "../utils/dotenv";

const templatePath = require.resolve("./create-dotenv.template.env");

export async function createDotEnvModule(
  envVariables: VariableDictionary = []
): Promise<ModuleMap> {
  return pluginWrapper(
    createDotEnvModuleInternal,
    EventNames.CreateAdminDotEnv,
    {
      envVariables,
    }
  );
}

/**
 * Creates the .env file based on the given template with placeholder.
 * The function replaces any placeholder in a ${name} format based on the key in the appInfo.settings
 * @returns grants JSON modulemaps
 */
export async function createDotEnvModuleInternal({
  envVariables,
}: CreateAdminDotEnvParams): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  const { appInfo, clientDirectories } = context;

  const MODULE_PATH = `${clientDirectories.baseDirectory}/.env`;
  const code = await readCode(templatePath);
  const envVariablesWithoutDuplicateKeys = removeDuplicateKeys(envVariables);
  const extractedVariables = extractVariablesFromCode(code);
  const allVariables = [
    ...extractedVariables,
    ...envVariablesWithoutDuplicateKeys,
  ];
  const envVariablesSorted = sortAlphabetically(allVariables);
  const codeWithEnvVariables = convertToKeyValueString(envVariablesSorted);

  const serviceSettingsDic: { [key: string]: any } = appInfo.settings;

  const dotEnvModule: Module = {
    path: MODULE_PATH,
    code: replacePlaceholdersInCode(codeWithEnvVariables, serviceSettingsDic),
  };

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(dotEnvModule);
  return moduleMap;
}

function convertToKeyValueString(arr: VariableDictionary): string {
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
