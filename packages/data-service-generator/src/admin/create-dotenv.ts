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
  const formattedAdditionalVariables =
    convertToKeyValueString(envVariablesSorted);
  const codeWithAdditionalVariables = appendAdditionalVariables(
    "",
    formattedAdditionalVariables
  );

  const serviceSettingsDic: { [key: string]: any } = appInfo.settings;

  const dotEnvModule: Module = {
    path: MODULE_PATH,
    code: replacePlaceholdersInCode(
      codeWithAdditionalVariables,
      serviceSettingsDic
    ),
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

function sortAlphabetically(arr: VariableDictionary): VariableDictionary {
  const dict = {};
  arr.forEach((item) => {
    const [currentKey] = Object.keys(item);
    const [currentValue] = Object.values(item);
    dict[currentKey] = currentValue;
  });

  const sorted = Object.keys(dict)
    .sort()
    .reduce((arr, key) => {
      arr.push({ [key]: dict[key] });
      return arr;
    }, []);

  return sorted;
}

function extractVariablesFromCode(code: string): VariableDictionary {
  const arr: VariableDictionary = [];
  code.split("\n").forEach((line) => {
    const content = line.split("=");
    if (!content || content.length != 2) {
      return;
    }

    const [key, value] = content;
    arr.push({ [key]: value });
  });
  return arr;
}
