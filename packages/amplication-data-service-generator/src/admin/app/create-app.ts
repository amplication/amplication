import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Module, AppInfo } from "../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { readFile, relativeImportPath } from "../../util/module";
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
  const resources = Object.entries(entitiesComponents).map(
    ([entityName, entityComponents]) => {
      return jsxElement`<Resource
          name="${entityName}"
          list={${entityName}List}
          edit={${entityName}Edit}
          create={${entityName}Create}
          show={${entityName}Show}
        />`;
    }
  );
  interpolate(file, {
    APP_NAME: builders.stringLiteral(appInfo.name),
    RESOURCES: jsxFragment`<>${resources}</>`,
  });
  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  const entityImports = Object.values(entitiesComponents).flatMap(
    (entityComponents) => {
      return Object.values(entityComponents).map((entityComponent) => {
        return importNames(
          [builders.identifier(entityComponent.name)],
          relativeImportPath(PATH, entityComponent.modulePath)
        );
      });
    }
  );
  addImports(file, [...entityImports]);
  return {
    path: PATH,
    code: print(file).code,
  };
}
