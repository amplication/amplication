import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile, relativeImportPath } from "../../util/module";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");
const PATH = "admin/src/App.tsx";
const ROUTE_ID = builders.jsxIdentifier("Route");

export async function createAppModule(entities: Entity[]): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  const entityToListComponentName = Object.fromEntries(
    entities.map((entity) => [entity.name, `${entity.name}List`])
  );
  const entityToCreateComponentName = Object.fromEntries(
    entities.map((entity) => [entity.name, `Create${entity.name}`])
  );
  const entityToUpdateComponentName = Object.fromEntries(
    entities.map((entity) => [entity.name, `Update${entity.name}`])
  );
  interpolate(file, {
    ROUTES: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entities.flatMap((entity) => {
        const entityPath = "/" + paramCase(plural(entity.name));
        return [
          createRouteElement(
            entityPath,
            builders.identifier(entityToListComponentName[entity.name]),
            true
          ),
          createRouteElement(
            `${entityPath}/new`,
            builders.identifier(entityToCreateComponentName[entity.name]),
            true
          ),
          createRouteElement(
            `${entityPath}/:id`,
            builders.identifier(entityToUpdateComponentName[entity.name]),
            true
          ),
        ];
      })
    ),
  });
  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  const entityImports = entities.flatMap((entity) => {
    const listComponentName = entityToListComponentName[entity.name];
    const createComponentName = entityToCreateComponentName[entity.name];
    const updateComponentName = entityToUpdateComponentName[entity.name];
    /** @todo use created modules */
    return [
      importNames(
        [builders.identifier(listComponentName)],
        relativeImportPath(PATH, `admin/src/${listComponentName}.tsx`)
      ),
      importNames(
        [builders.identifier(createComponentName)],
        relativeImportPath(PATH, `admin/src/${createComponentName}.tsx`)
      ),
      importNames(
        [builders.identifier(updateComponentName)],
        relativeImportPath(PATH, `admin/src/${updateComponentName}.tsx`)
      ),
    ];
  });
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
