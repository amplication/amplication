import { ModuleMap } from "@amplication/code-gen-types";
import { merge } from "lodash";
import * as semver from "semver";

/**
 * Update package.json and package-lock.json modules in given modules with the
 * given update
 * @param modules modules array to update the package files in
 * @param baseDirectory the base directory of the modules paths
 * @param update the update to apply to the package files
 */
export async function updatePackageJSONs(
  modules: ModuleMap,
  baseDirectory: string,
  update: { [key: string]: any }[]
): Promise<ModuleMap> {
  await modules.replaceModulesCode((code) =>
    preparePackageJsonFile(code, update)
  );

  return modules;
}

function preparePackageJsonFile(
  code: string,
  updateProperties: { [key: string]: any }[]
): any {
  const parsedPkg = JSON.parse(code);
  updateProperties &&
    updateProperties.forEach((updateProperty) =>
      merge(parsedPkg, updateProperty)
    );

  if (!semver.valid(parsedPkg.version)) {
    delete parsedPkg.version;
  }

  return JSON.stringify(parsedPkg, null, 2);
}
