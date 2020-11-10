import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity } from "../../types";
import { interpolate, removeTSVariableDeclares } from "../../util/ast";
import { Module, readFile } from "../../util/module";
import { paramCase } from "param-case";

const navigationTemplatePath = path.resolve(
  __dirname,
  "Navigation.template.tsx"
);
const PATH = "admin/src/Navigation.tsx";
const NAVIGATION_ITEM_ID = builders.jsxIdentifier("NavigationItem");

export async function createNavigationModule(
  entities: Entity[]
): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  interpolate(file, {
    ITEMS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entities.map((entity) =>
        builders.jsxElement(
          builders.jsxOpeningElement(
            NAVIGATION_ITEM_ID,
            [
              builders.jsxAttribute(
                builders.jsxIdentifier("name"),
                builders.stringLiteral(entity.displayName)
              ),
              builders.jsxAttribute(
                builders.jsxIdentifier("to"),
                builders.stringLiteral("/" + paramCase(entity.name))
              ),
            ],
            true
          )
        )
      )
    ),
  });
  removeTSVariableDeclares(file);
  return {
    path: PATH,
    code: print(file).code,
  };
}
