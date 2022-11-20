import {
  CreateServerPackageJsonParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";
import { updatePackageJSONs } from "../../update-package-jsons";

const PACKAGE_JSON_ENCODING = "utf-8";
const PACKAGE_JSON_TEMPLATE = "package.template.json";
const PACKAGE_JSON_FILE_NAME = "package.json";

export function createServerPackageJson(
  eventParams: CreateServerPackageJsonParams
): Promise<Module[]> {
  return pluginWrapper(
    createServerPackageJsonInternal,
    EventNames.CreateServerPackageJson,
    eventParams
  );
}

async function createServerPackageJsonInternal({
  updateProperties,
}: CreateServerPackageJsonParams): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const packageJsonModule = await readFile(
    resolve(__dirname, PACKAGE_JSON_TEMPLATE),
    PACKAGE_JSON_ENCODING
  );
  const mutatedPackageJson = updatePackageJSONs(
    [
      {
        path: join(serverDirectories.baseDirectory, PACKAGE_JSON_FILE_NAME),
        code: packageJsonModule,
      },
    ],
    serverDirectories.baseDirectory,
    updateProperties
  );
  return mutatedPackageJson;
}
