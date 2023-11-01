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
  await modules.replaceModulesCode((path, code) =>
    preparePackageJsonFile(code, update)
  );

  return modules;
}

function sortObject(object: { [key: string]: any }): { [key: string]: any } {
  return Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
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

  if (parsedPkg.dependencies) {
    parsedPkg.dependencies = sortObject(parsedPkg.dependencies);
  }
  if (parsedPkg.devDependencies) {
    parsedPkg.devDependencies = sortObject(parsedPkg.devDependencies);
  }

  return JSON.stringify(parsedPkg, null, 2);
}
