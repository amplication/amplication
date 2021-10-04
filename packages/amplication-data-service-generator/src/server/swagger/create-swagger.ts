import { builders, namedTypes } from "ast-types";
import { EnumAuthProviderType } from "../../models";
import { print } from "recast";
import { AppInfo, Module } from "../../types";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
} from "../../util/ast";
import { readFile } from "../../util/module";
import { SRC_DIRECTORY } from "../constants";

const MODULE_PATH = `${SRC_DIRECTORY}/swagger.ts`;

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export const INSTRUCTIONS = `## Congratulations! Your application is ready.

Please note that all endpoints are secured with HTTP basic authentication.
By default, your app comes with one user with the username "admin" and password "admin".
Learn more in [our docs](https://docs.amplication.com)`;

export const INSTRUCTIONS_BUFFER = "\n\n";

export async function createSwagger(appInfo: AppInfo): Promise<Module> {
  const { settings } = appInfo;
  const { authProvider } = settings;
  const file = await readFile(swaggerTemplatePath);
  const description = await createDescription(appInfo);

  interpolate(file, {
    TITLE: builders.stringLiteral(appInfo.name),
    DESCRIPTION: builders.stringLiteral(description),
    VERSION: builders.stringLiteral(appInfo.version),
    AUTH_FUNCTION: getSwaggerAuthFunctionId(authProvider),
  });

  removeTSVariableDeclares(file);
  removeTSIgnoreComments(file);
  return {
    code: print(file).code,
    path: MODULE_PATH,
  };
}

export async function createDescription(appInfo: AppInfo): Promise<string> {
  return [appInfo.description || "", INSTRUCTIONS].join(INSTRUCTIONS_BUFFER);
}

export function getSwaggerAuthFunctionId(
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
