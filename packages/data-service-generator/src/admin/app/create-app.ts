import * as path from "path";
import {
  print,
  readFile,
  removeTSVariableDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders } from "ast-types";
import { Module } from "@amplication/code-gen-types";
import { addImports, importNames, interpolate } from "../../utils/ast";
import { relativeImportPath } from "../../utils/module";

import { jsxElement, jsxFragment } from "../util";
import { EntityComponents } from "../types";
import DsgContext from "../../dsg-context";

const navigationTemplatePath = path.resolve(__dirname, "App.template.tsx");

export async function createAppModule(
  entitiesComponents: Record<string, EntityComponents>
): Promise<Module> {
  const { clientDirectories, appInfo } = DsgContext.getInstance;
  const PATH = `${clientDirectories.srcDirectory}/App.tsx`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const file = await readFile(navigationTemplatePath);
  const authProviderName = authProvider.toLowerCase();
  const authProviderIdentifier = builders.identifier(
    `${authProviderName}AuthProvider`
  );
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
    RESOURCE_NAME: builders.stringLiteral(appInfo.name),
    RESOURCES: jsxFragment`<>${resources}</>`,
    AUTH_PROVIDER_NAME: authProviderIdentifier,
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
  const authProviderImport = importNames(
    [authProviderIdentifier],
    relativeImportPath(
      PATH,
      `${clientDirectories.authDirectory}/ra-auth-${authProviderName}.ts`
    )
  );
  addImports(file, [...entityImports, authProviderImport]);
  return {
    path: PATH,
    code: print(file).code,
  };
}
