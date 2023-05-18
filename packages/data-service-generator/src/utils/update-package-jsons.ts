import { Module } from "@amplication/code-gen-types";
import { preparePackageJsonFile } from "./preparePackageJsonFile";

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
  return modules.map((module) => updatePackageJSON(module, update));
}

function updatePackageJSON(module: Module, update: { [key: string]: any }[]) {
  const pkg = preparePackageJsonFile(module, update);

  return {
    ...module,
    code: pkg,
  };
}
