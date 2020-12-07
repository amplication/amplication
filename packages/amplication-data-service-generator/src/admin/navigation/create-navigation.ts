import * as path from "path";
import { print } from "recast";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity, Module } from "../../types";
import { interpolate, removeTSVariableDeclares } from "../../util/ast";
import { readFile } from "../../util/module";
import { SRC_DIRECTORY } from "../constants";
import { jsxElement, jsxFragment } from "../util";

const navigationTemplatePath = path.resolve(
  __dirname,
  "Navigation.template.tsx"
);
const PATH = `${SRC_DIRECTORY}/Navigation.tsx`;

export async function createNavigationModule(
  entities: Entity[]
): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  interpolate(file, {
    ITEMS: jsxFragment`<>${entities.map((entity) => {
      return jsxElement`<NavigationItem name="${
        entity.pluralDisplayName
      }" to="/${paramCase(plural(entity.name))}" />`;
    })}</>`,
  });
  removeTSVariableDeclares(file);
  return {
    path: PATH,
    code: print(file).code,
  };
}
