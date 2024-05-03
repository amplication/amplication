import {
  CreateServerPackageJsonParams,
  EventNames,
  ModuleMap,
  Module,
} from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { updatePackageJSONs } from "../../utils/update-package-jsons";
import { paramCase } from "param-case";
import { promises as fs } from "fs";
import { addDecimalJSPackageIfNecessary } from "./decimaljs";

const PACKAGE_JSON_ENCODING = "utf-8";
const PACKAGE_JSON_FILE_NAME = "package.json";

const filePath = resolve(__dirname, PACKAGE_JSON_FILE_NAME);

export async function createServerPackageJson(): Promise<ModuleMap> {
  const fileContent = await fs.readFile(filePath, PACKAGE_JSON_ENCODING);
  const { appInfo } = DsgContext.getInstance;
  const updateProperties = [
    {
      name: `@${paramCase(appInfo.name)}/server`,
      version: appInfo.version,
    },
  ];

  return pluginWrapper(
    createServerPackageJsonInternal,
    EventNames.CreateServerPackageJson,
    { fileContent, updateProperties }
  );
}

async function createServerPackageJsonInternal({
  updateProperties,
}: CreateServerPackageJsonParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const packageJsonModule: Module = {
    path: join(serverDirectories.baseDirectory, PACKAGE_JSON_FILE_NAME),
    code: await readFile(
      resolve(__dirname, PACKAGE_JSON_FILE_NAME),
      PACKAGE_JSON_ENCODING
    ),
  };
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.set(packageJsonModule);

  addDecimalJSPackageIfNecessary(updateProperties);

  const mutatedPackageJson = await updatePackageJSONs(
    moduleMap,
    serverDirectories.baseDirectory,
    updateProperties
  );
  return mutatedPackageJson;
}
