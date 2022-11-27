import {
  CreateAdminUIPackageJsonParams,
  Module,
  EventNames,
} from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { updatePackageJSONs } from "../../update-package-jsons";
import { paramCase } from "param-case";
import { promises as fs } from "fs";

const PACKAGE_JSON_ENCODING = "utf-8";
const PACKAGE_JSON_TEMPLATE = "package.template.json";
const PACKAGE_JSON_FILE_NAME = "package.json";

const filePath = resolve(__dirname, PACKAGE_JSON_TEMPLATE);

export async function createAdminUIPackageJson(): Promise<Module[]> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { appInfo } = DsgContext.getInstance;
  const updateProperties = [
    {
      name: `@${paramCase(appInfo.name)}/admin`,
      version: appInfo.version,
    },
  ];

  return pluginWrapper(
    createAdminUIPackageJsonInternal,
    EventNames.CreateAdminUIPackageJson,
    { fileContent, updateProperties }
  );
}

async function createAdminUIPackageJsonInternal({
  updateProperties,
}: CreateAdminUIPackageJsonParams): Promise<Module[]> {
  const { clientDirectories } = DsgContext.getInstance;
  const packageJsonModule = await readFile(
    resolve(__dirname, PACKAGE_JSON_TEMPLATE),
    PACKAGE_JSON_ENCODING
  );
  const mutatedPackageJson = updatePackageJSONs(
    [
      {
        path: join(clientDirectories.baseDirectory, PACKAGE_JSON_FILE_NAME),
        code: packageJsonModule,
      },
    ],
    clientDirectories.baseDirectory,
    updateProperties
  );
  return mutatedPackageJson;
}
