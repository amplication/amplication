import { Module } from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { JsonValue } from "type-fest";
import { updatePackageJSONs } from "../../update-package-jsons";

type CreatePackageJsonEventParams = {
  update: Record<string, JsonValue>;
};

const PACKAGE_JSON_ENCODING = "utf-8";
const PACKAGE_JSON_TEMPLATE = "package.template.json";
const PACKAGE_JSON_FILE_NAME = "package.json";

export async function createPackageJson({
  update,
}: CreatePackageJsonEventParams): Promise<Module[]> {
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
    update
  );
  return mutatedPackageJson;
}
