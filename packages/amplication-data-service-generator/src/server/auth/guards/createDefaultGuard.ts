import { builders } from "ast-types";
import { print } from "recast";
import { AUTH_PATH } from "../../constants";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSClassDeclares,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";

type AuthGuardMetaData = {
  path: string;
  fileName: string;
  className: string;
};

export async function createDefaultGuard(
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const defaultAuthGuardPath = require.resolve(
    "./defaultAuth.guard.template.ts"
  );
  const modulePath = `${AUTH_PATH}/defaultAuth.guard.ts`;

  const templateGuardFile = await readFile(defaultAuthGuardPath);
  const { path, className } = getMetaDataForAuthGuard(authProvider);
  const baseGuardIdentifier = builders.identifier(className);
  interpolate(templateGuardFile, {
    GUARD: baseGuardIdentifier,
  });
  const baseGuardImport = importNames(
    [baseGuardIdentifier],
    relativeImportPath(modulePath, path)
  );
  addImports(templateGuardFile, [baseGuardImport]);
  removeTSClassDeclares(templateGuardFile);
  return { path: modulePath, code: print(templateGuardFile).code };
}

function getMetaDataForAuthGuard(
  authGuard: string
): AuthGuardMetaData {
  const lowCaseAG = authGuard.toLowerCase()
  const fileName = lowCaseAG + "Auth";
  const data: AuthGuardMetaData = {
    fileName, 
    path: `${AUTH_PATH}/${lowCaseAG}/${fileName}.guard.ts`, 
    className: capitalizeFirstLetter(lowCaseAG) + "AuthGuard"
  };
  return data;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
