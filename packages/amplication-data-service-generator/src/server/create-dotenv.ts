import { Module, AppInfo } from "@amplication/code-gen-types";
import { isEmpty } from "lodash";
import { readCode } from "../util/module";
import { replacePlaceholdersInCode } from "../util/text-file-parser";

const templatePath = require.resolve("./create-dotenv.template.env");

type AdditionalVariables = {
  [variable: string]: string;
}[];
/**
 * Creates the .env file based on the given template with placeholder.
 * The function replaces any placeholder in a ${name} format based on the key in the appInfo.settings
 * @returns grants JSON module
 */
export async function createDotEnvModule(
  appInfo: AppInfo,
  baseDirectory: string,
  additionalVariables: AdditionalVariables
): Promise<Module> {
  const code = await readCode(templatePath);
  const formattedAdditionalVariables = convertToKeyValueSting(
    additionalVariables
  );
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

  return {
    path: `${baseDirectory}/.env`,
    code: replacePlaceholdersInCode(
      codeWithAdditionalVariables,
      appInfo.settings
    ),
  };
}

function convertToKeyValueSting(arr: AdditionalVariables): string {
  if (!arr.length) return "";
  return arr
    .map((item) =>
      Object.entries(item).map(([key, value]) => `${key}=${value}`)
    )
    .join("\n");
}

function appendAdditionalVariables(file: string, variable: string): string {
  if (!variable.trim()) return file;
  return file.concat(`\n${variable}`);
}
