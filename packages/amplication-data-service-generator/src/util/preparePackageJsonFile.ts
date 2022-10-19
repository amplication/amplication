import { Module } from "@amplication/code-gen-types";
import { merge } from "lodash";
import * as semver from "semver";

export function preparePackageJsonFile(
  module: Module,
  updateProperties: { [key: string]: any }[]
): any {
  const parsedPkg = JSON.parse(module.code);
  updateProperties &&
    updateProperties.forEach((updateProperty) =>
      merge(parsedPkg, updateProperty)
    );

  if (!semver.valid(parsedPkg.version)) {
    delete parsedPkg.version;
  }

  return JSON.stringify(parsedPkg, null, 2);
}
