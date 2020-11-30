import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import {
  addImports,
  importNames,
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile, relativeImportPath } from "../../util/module";
import { EntityComponents } from "../types";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");
const PATH = "admin/src/App.tsx";
const ROUTE_ID = builders.jsxIdentifier("Route");

export async function createAppModule(
  entitiesComponents: Record<string, EntityComponents>
): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  interpolate(file, {
    ROUTES: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      Object.entries(entitiesComponents).flatMap(
        ([entityName, entityComponents]) => {
          const entityPath = "/" + paramCase(plural(entityName));
          return [
            createRouteElement(
              entityPath,
              builders.identifier(entityComponents.list.name),
              true
            ),
            createRouteElement(
              `${entityPath}/new`,
              builders.identifier(entityComponents.create.name),
              true
            ),
            createRouteElement(
              `${entityPath}/:id`,
              builders.identifier(entityComponents.update.name),
              true
            ),
          ];
        }
      )
    ),
  });
  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  const entityImports = Object.values(
    entitiesComponents
  ).flatMap((entityComponents) =>
    Object.values(entityComponents).map((component) =>
      importNames(
        [builders.identifier(component.name)],
        relativeImportPath(PATH, component.modulePath)
      )
    )
  );
  addImports(file, [...entityImports]);
  return {
    path: PATH,
    code: print(file).code,
  };
}

function createRouteElement(
  path: string,
  component: namedTypes.Identifier,
  exact = false
): namedTypes.JSXElement {
  const attributes = [
    builders.jsxAttribute(
      builders.jsxIdentifier("path"),
      builders.stringLiteral(path)
    ),
    builders.jsxAttribute(
      builders.jsxIdentifier("component"),
      builders.jsxExpressionContainer(component)
    ),
  ];
  if (exact) {
    attributes.unshift(builders.jsxAttribute(builders.jsxIdentifier("exact")));
  }
  return builders.jsxElement(
    builders.jsxOpeningElement(ROUTE_ID, attributes, true)
  );
}
