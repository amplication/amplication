import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity } from "../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile, relativeImportPath } from "../../util/module";
import { paramCase } from "param-case";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");
const PATH = "admin/src/App.tsx";
const ROUTE_ID = builders.jsxIdentifier("Route");

export async function createAppModule(entities: Entity[]): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  interpolate(file, {
    ROUTES: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entities.map((entity) =>
        builders.jsxElement(
          builders.jsxOpeningElement(
            ROUTE_ID,
            [
              builders.jsxAttribute(
                builders.jsxIdentifier("path"),
                builders.stringLiteral("/" + paramCase(entity.name))
              ),
              builders.jsxAttribute(
                builders.jsxIdentifier("component"),
                builders.jsxExpressionContainer(
                  builders.identifier(entity.displayName)
                )
              ),
            ],
            true
          )
        )
      )
    ),
  });
  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  const entityImports = entities.map((entity) =>
    /** @todo use created modules */
    importNames(
      [builders.identifier(entity.name)],
      relativeImportPath(PATH, `admin/src/${entity.name}.tsx`)
    )
  );
  addImports(file, [...entityImports]);
  return {
    path: PATH,
    code: print(file).code,
  };
}
