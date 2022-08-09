import { builders, namedTypes } from "ast-types";
import { EnumAuthProviderType } from "../../models";
import { print } from "recast";
import { AppInfo, Module } from "@amplication/code-gen-types";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { readFile } from "../../util/module";

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export const INSTRUCTIONS_BUFFER = "\n\n";

export async function createSwagger(
  appInfo: AppInfo,
  srcDirectory: string
): Promise<Module> {
  const MODULE_PATH = `${srcDirectory}/swagger.ts`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const file = await readFile(swaggerTemplatePath);
  const description = await createDescription(appInfo);

  interpolate(file, {
    TITLE: builders.stringLiteral(appInfo.name),
    DESCRIPTION: builders.stringLiteral(description),
    VERSION: builders.stringLiteral(appInfo.version),
    AUTH_FUNCTION: builders.identifier(
      authProvider === EnumAuthProviderType.Http
        ? "addBasicAuth"
        : "addBearerAuth"
    ),
  });

  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  return {
    code: print(file).code,
    path: MODULE_PATH,
  };
}

export async function createDescription(appInfo: AppInfo): Promise<string> {
  return [
    appInfo.description || "",
    getInstructions(appInfo.settings.authProvider),
  ].join(INSTRUCTIONS_BUFFER);
}

function getInstructionsAuthentication(
  authProvider: EnumAuthProviderType
): string {
  switch (authProvider) {
    case EnumAuthProviderType.Http:
      return "HTTP Basic";
    case EnumAuthProviderType.Jwt:
      return "JWT Bearer";
  }
}

export function getInstructions(authProvider: EnumAuthProviderType): string {
  return `## Congratulations! Your service resource is ready.
  
Please note that all endpoints are secured with ${getInstructionsAuthentication(
    authProvider
  )} authentication.
By default, your service resource comes with one user with the username "admin" and password "admin".
Learn more in [our docs](https://docs.amplication.com)`;
}

export function getSwaggerAuthDecorationIdForClass(
  authProvider: EnumAuthProviderType
): namedTypes.Identifier {
  switch (authProvider) {
    case EnumAuthProviderType.Http:
      return builders.identifier("ApiBasicAuth");
    case EnumAuthProviderType.Jwt:
      return builders.identifier("ApiBearerAuth");
    default:
      throw new Error(
        "Not got valid auth provider to the getSwaggerAuthFunction"
      );
  }
}
