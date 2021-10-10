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

/**
 *
 *
 * @param update object that contain the update data to enter instead of the default data as name and version
 * @returns the updated module
 *
 * In npm 7 and higher the package lock contains a packages section (lockfile v2)
 * to see the npm docs of this update https://github.blog/2021-02-02-npm-7-is-now-generally-available/#changes-to-the-lockfile
 */
function updatePackageLockJSON(
  module: Module,
  update: Record<string, any>
): Module {
  const lockfile = JSON.parse(module.code);
  /**
   * The v2 lockfile contains a package in the packages section that is a mirror of the project so we need to update the static data there also
   */
  const pkg = lockfile.packages[""];

  Object.assign(lockfile, update);
  Object.assign(pkg, update);

  if (!semver.valid(lockfile.version)) {
    delete lockfile.version;
  }

  if (!semver.valid(pkg.version)) {
    delete pkg.version;
  }

  return {
    ...module,
    code: JSON.stringify(lockfile, null, 4),
  };
}
