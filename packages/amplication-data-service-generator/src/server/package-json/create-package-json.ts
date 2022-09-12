import { Module } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { JsonValue } from "type-fest";
import { updatePackageJSONs } from "../../update-package-jsons";

type CreatePackageJsonEventParams = {
  update: Record<string, JsonValue>;
  baseDirectory: string;
};

const PACKAGE_JSON_ENCODING = "utf-8";
const PACKAGE_JSON_TEMPLATE = "package.template.json";
const PACKAGE_JSON_FILE_NAME = "package.json";

export async function createPackageJson({
  baseDirectory,
  update,
}: CreatePackageJsonEventParams): Promise<Module[]> {
  const packageJsonModule = await readFile(
    resolve(__dirname, PACKAGE_JSON_TEMPLATE),
    PACKAGE_JSON_ENCODING
  );

  const mutatedPackageJson = updatePackageJSONs(
    [
      {
        path: join(baseDirectory, PACKAGE_JSON_FILE_NAME),
        code: packageJsonModule,
      },
    ],
    baseDirectory,
    update
  );
  return mutatedPackageJson;
}
