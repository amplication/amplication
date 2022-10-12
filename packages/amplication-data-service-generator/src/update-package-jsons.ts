import * as semver from "semver";
import { Module } from "@amplication/code-gen-types";
import { preparePackageJsonFile } from "./util/preparePackageJsonFile";

/**
 * Update package.json and package-lock.json modules in given modules with the
 * given update
 * @param modules modules array to update the package files in
 * @param baseDirectory the base directory of the modules paths
 * @param update the update to apply to the package files
 */
export function updatePackageJSONs(
  modules: Module[],
  baseDirectory: string,
  update: { [key: string]: any }[]
): Module[] {
  return modules.map((module) => {
    const updateModule =
      module.path === `${baseDirectory}/package.json`
        ? updatePackageJSON(module, update)
        : module;

    return updateModule;
  });
}

function updatePackageJSON(module: Module, update: { [key: string]: any }[]) {
  const pkg = preparePackageJsonFile(module, update);

  if (!semver.valid(pkg.version)) {
    delete pkg.version;
  }

  return {
    ...module,
    code: pkg,
  };
}
