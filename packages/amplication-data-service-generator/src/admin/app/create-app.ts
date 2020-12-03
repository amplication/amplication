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
import { SRC_DIRECTORY } from "../constants";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");
const PATH = `${SRC_DIRECTORY}/App.tsx`;
const ROUTE_ID = builders.jsxIdentifier("Route");
const PATH_ID = builders.jsxIdentifier("path");
const COMPONENT_ID = builders.jsxIdentifier("component");
const EXACT_ID = builders.jsxIdentifier("exact");

export async function createAppModule(
  entitiesComponents: Record<string, EntityComponents>
): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  const entitiesRoutes = Object.entries(entitiesComponents).flatMap(
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
          builders.identifier(entityComponents.new.name),
          true
        ),
        createRouteElement(
          `${entityPath}/:id`,
          builders.identifier(entityComponents.entity.name),
          true
        ),
      ];
    }
  );
  interpolate(file, {
    ROUTES: builders.jsxElement(
      builders.jsxOpeningElement(builders.jsxIdentifier("Switch")),
      builders.jsxClosingElement(builders.jsxIdentifier("Switch")),
      [
        builders.jsxExpressionContainer(builders.identifier("loginRoute")),
        ...entitiesRoutes,
      ]
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
    builders.jsxAttribute(PATH_ID, builders.stringLiteral(path)),
    builders.jsxAttribute(
      COMPONENT_ID,
      builders.jsxExpressionContainer(component)
    ),
  ];
  if (exact) {
    attributes.unshift(builders.jsxAttribute(EXACT_ID));
  }
  return builders.jsxElement(
    builders.jsxOpeningElement(ROUTE_ID, attributes, true)
  );
}
