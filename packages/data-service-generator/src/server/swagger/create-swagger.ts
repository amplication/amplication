import { builders, namedTypes } from "ast-types";
import { EnumAuthProviderType } from "../../models";
import {
  print,
  readFile,
  removeTSVariableDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import {
  AppInfo,
  CreateSwaggerParams,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { interpolate } from "../../utils/ast";

import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export const INSTRUCTIONS_BUFFER = "\n\n";

export async function createSwagger(): Promise<ModuleMap> {
  const { serverDirectories, appInfo } = DsgContext.getInstance;
  const { settings } = appInfo;
  const { authProvider } = settings;

  const description = await createDescription(appInfo);
  const outputFileName = "swagger.ts";
  const fileDir = serverDirectories.srcDirectory;

  const template = await readFile(swaggerTemplatePath);
  const templateMapping = {
    TITLE: builders.stringLiteral(appInfo.name),
    DESCRIPTION: builders.stringLiteral(description),
    VERSION: builders.stringLiteral(appInfo.version),
    AUTH_FUNCTION: builders.identifier(
      authProvider === EnumAuthProviderType.Http
        ? "addBasicAuth"
        : "addBearerAuth"
    ),
  };

  return pluginWrapper(createSwaggerInternal, EventNames.CreateSwagger, {
    template,
    templateMapping,
    fileDir,
    outputFileName,
  });
}

async function createSwaggerInternal({
  template,
  templateMapping,
  fileDir,
  outputFileName,
}: CreateSwaggerParams): Promise<ModuleMap> {
  interpolate(template, templateMapping);

  removeTSVariableDeclares(template);
  removeTSIgnoreComments(template);
  const module: Module = {
    code: print(template).code,
    path: `${fileDir}/${outputFileName}`,
  };

  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
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
