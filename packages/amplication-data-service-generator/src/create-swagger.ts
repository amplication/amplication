import { print } from "recast";
import { builders } from "ast-types";
import { interpolate, removeTSVariableDeclares } from "./util/ast";
import { Module, readFile } from "./util/module";
import { AppInfo } from "./types";

const PATH = "swagger.ts";

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export async function createSwagger(appInfo: AppInfo): Promise<Module> {
  const file = await readFile(swaggerTemplatePath);

  const instructions = `
  
  ## Congratulations! Your application is ready. 
  Please note that all endpoints are secured with HTTP basic authentication. 
  By default, your app comes with one user with the username "admin" and password "admin".
  Learn more in [our docs](https://docs.amplication.com)`;

  const description = (appInfo.description || "") + instructions;
  console.log("appInfo.description", appInfo.description);
  console.log("description", description);

  interpolate(file, {
    TITLE: builders.stringLiteral(appInfo.name),
    DESCRIPTION: builders.stringLiteral(description),
    VERSION: builders.stringLiteral(appInfo.version),
  });
  removeTSVariableDeclares(file);
  return {
    code: print(file).code,
    path: PATH,
  };
}
