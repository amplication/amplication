import { print } from "recast";
import { builders } from "ast-types";
import { AppInfo, Module } from "../../types";
import { interpolate, removeTSVariableDeclares } from "../../util/ast";
import { readFile } from "../../util/module";
import { SRC_DIRECTORY } from "../constants";
import { EnumAuthProviderType } from "../../models";

const MODULE_PATH = `${SRC_DIRECTORY}/swagger.ts`;

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export const INSTRUCTIONS = `## Congratulations! Your application is ready.

Please note that all endpoints are secured with HTTP basic authentication.
By default, your app comes with one user with the username "admin" and password "admin".
Learn more in [our docs](https://docs.amplication.com)`;

export const INSTRUCTIONS_BUFFER = "\n\n";

export async function createSwagger(appInfo: AppInfo): Promise<Module> {
  const file = await readFile(swaggerTemplatePath);
  const description = await createDescription(appInfo);

  interpolate(file, {
    TITLE: builders.stringLiteral(appInfo.name),
    DESCRIPTION: builders.stringLiteral(description),
    VERSION: builders.stringLiteral(appInfo.version),
  });

  removeTSVariableDeclares(file);

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

function getInstructionsAuthentication(authProvider: EnumAuthProviderType) {
  switch (authProvider) {
    case EnumAuthProviderType.Http:
      return "HTTP Basic";
    case EnumAuthProviderType.Jwt:
      return "JWT Bearer";
  }
}

export function getInstructions(authProvider: EnumAuthProviderType): string {
  const INSTRUCTIONS = `## Congratulations! Your application is ready.
  
Please note that all endpoints are secured with ${getInstructionsAuthentication(
    authProvider
  )} authentication.
By default, your app comes with one user with the username "admin" and password "admin".
Learn more in [our docs](https://docs.amplication.com)`;
  return INSTRUCTIONS;
}
