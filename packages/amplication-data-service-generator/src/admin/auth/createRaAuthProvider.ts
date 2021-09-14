import { builders } from "ast-types";
import { resolve } from "path";
import { print } from "recast";
import { EnumAuthProviderType } from "../../models";
import { Module } from "../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSVariableDeclares,
} from "../../util/ast";
import { readFile, relativeImportPath } from "../../util/module";
import { AUTH_PROVIDER_PATH } from "../constants";

type AuthProviderMetadata = {
  baseProviderObjectName: string;
  basePath: string;
};

export async function createRaAuthProvider(
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const modulePath = `${AUTH_PROVIDER_PATH}/ra-auth.ts`;
  const templatePath = resolve(__dirname, "templates", "ra-auth.template.ts");
  const { baseProviderObjectName, basePath } = getMetadataForRABaseAuthProvider(
    authProvider
  );
  const baseRaAuth = builders.identifier(baseProviderObjectName);
  const templateFile = await readFile(templatePath);
  interpolate(templateFile, {
    AUTH_PROVIDER: baseRaAuth,
  });
  const baseRaAuthImport = importNames(
    [baseRaAuth],
    relativeImportPath(modulePath, basePath)
  );
  addImports(templateFile, [baseRaAuthImport]);
  removeTSVariableDeclares(templateFile);
  return { path: modulePath, code: print(templateFile).code };
}

function getMetadataForRABaseAuthProvider(
  authProvider: EnumAuthProviderType
): AuthProviderMetadata {
  const data: AuthProviderMetadata = {
    basePath: "",
    baseProviderObjectName: "",
  };
  switch (authProvider) {
    case "Jwt":
      data.baseProviderObjectName = "jwtAuthProvider";
      data.basePath = `${AUTH_PROVIDER_PATH}/bearer/ra-auth-bearer.ts`;
      break;
    case "Http":
      data.baseProviderObjectName = "basicHttpAuthProvider";
      data.basePath = `${AUTH_PROVIDER_PATH}/basic/ra-auth-basic-http.ts`;
      break;
    default:
      throw new Error(
        `Send unknown auth provider in CreateRaAuthProvider named: ${authProvider}`
      );
  }
  return data;
}
