import * as semver from "semver";
import { Module } from "./types";

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
  update: Record<string, any>
): Module[] {
  return modules.map((module) => {
    if (module.path === `${baseDirectory}/package.json`) {
      return updatePackageJSON(module, update);
    } else if (module.path === `${baseDirectory}/package-lock.json`) {
      return updatePackageLockJSON(module, update);
    }
    return module;
  });
}

function updatePackageJSON(module: Module, update: Record<string, any>) {
  const pkg = JSON.parse(module.code);

  Object.assign(pkg, update);

  if (!semver.valid(pkg.version)) {
    delete pkg.version;
  }

  return {
    ...module,
    code: JSON.stringify(pkg, null, 2),
  };
}

function updatePackageLockJSON(module: Module, update: Record<string, any>) {
  const lock = JSON.parse(module.code);
  const pkg = lock.packages[""];

  Object.assign(lock, update);
  Object.assign(pkg, update);

  if (!semver.valid(lock.version)) {
    delete lock.version;
  }

  if (!semver.valid(pkg.version)) {
    delete pkg.version;
  }

  return {
    ...module,
    code: JSON.stringify(lock, null, 4),
  };
}
