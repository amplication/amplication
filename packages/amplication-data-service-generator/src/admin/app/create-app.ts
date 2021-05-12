import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Module, AppInfo } from "../../types";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { readFile } from "../../util/module";
import { EntityComponents } from "../types";
import { SRC_DIRECTORY } from "../constants";
import { jsxElement, jsxFragment } from "../util";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");
const PATH = `${SRC_DIRECTORY}/App.tsx`;

export async function createAppModule(
  appInfo: AppInfo,
  entityToPath: Record<string, string>,
  entitiesComponents: Record<string, EntityComponents>
): Promise<Module> {
  const file = await readFile(navigationTemplatePath);
  const entitiesRoutes = Object.entries(entitiesComponents).map(
    ([entityName, entityComponents]) => {
      const entityPath = entityToPath[entityName];
      return jsxElement`<PrivateRoute path="${entityPath}"  />`;
    }
  );
  interpolate(file, {
    APP_NAME: builders.stringLiteral(appInfo.name),
    ROUTES: jsxFragment`<>${entitiesRoutes}</>`,
  });
  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  // const entityImports = Object.values(
  //   entitiesComponents
  // ).map((entityComponents) =>
  //   importNames(
  //     [builders.identifier(entityComponents.index.name)],
  //     relativeImportPath(PATH, entityComponents.index.modulePath)
  //   )
  // );
  //addImports(file, [...entityImports]);
  return {
    path: PATH,
    code: print(file).code,
  };
}
