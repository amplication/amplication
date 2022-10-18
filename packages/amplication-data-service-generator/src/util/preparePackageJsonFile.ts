import { Module } from "@amplication/code-gen-types";
import { merge } from "lodash";

export function preparePackageJsonFile(
  module: Module,
  updateProperties: { [key: string]: any }[]
): any {
  const parsedPkg = JSON.parse(module.code);
  updateProperties &&
    updateProperties.forEach((updateProperty) =>
      merge(parsedPkg, updateProperty)
    );

  return JSON.stringify(parsedPkg, null, 2);
}
