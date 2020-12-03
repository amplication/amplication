import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../types";
import { interpolate, removeTSVariableDeclares } from "../../util/ast";
import { Module, readFile } from "../../util/module";
import { SRC_DIRECTORY } from "../constants";
import { jsxElement } from "../util";

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
    ITEMS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entities.map((entity) => {
        return jsxElement`<NavigationItem name="${
          entity.pluralDisplayName
        }" to="/${paramCase(plural(entity.name))}" />`;
      })
    ),
  });
  removeTSVariableDeclares(file);
  return {
    path: PATH,
    code: print(file).code,
  };
}
