import { readFile, relativeImportPath } from "../../util/module";
import { Module } from "../../types";
import { resolve } from "path";
import { interpolate, importNames } from "../../util/ast";
import { builders } from "ast-types";
import { EnumAuthProviderType } from "../../models";

type AuthProviderMetadata = {
  baseProviderObjectName: string;
  basePath: string;
};

export async function createRaAuthProvider(
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const templatePath = resolve(__dirname, "templates", "ra-auth.template.ts");
  const { baseProviderObjectName } = getMetadataForRABaseAuthProvider(
    authProvider
  );
  const baseRaAuth = builders.identifier(baseProviderObjectName);
  const file = await readFile(templatePath);
  interpolate(file, {
    AUTH_PROVIDER: builders.identifier(baseProviderObjectName),
  });
  const baseRaAuthImport = importNames(
    [baseRaAuth],
    relativeImportPath(modulePath, path)
  );
}

function getMetadataForRABaseAuthProvider(
  authProvider: EnumAuthProviderType
): AuthProviderMetadata {
  switch (authProvider) {
    case "Jwt":
      return { baseProviderObjectName: "jwtAuthProvider" };
    case "Http":
      return { baseProviderObjectName: "basicHttpAuthProvider" };
    default:
      throw new Error(
        `Send unknown auth provider in CreateRaAuthProvider named: ${authProvider}`
      );
  }
}
