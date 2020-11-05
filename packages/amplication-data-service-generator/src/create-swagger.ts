import { print } from "recast";
import { builders } from "ast-types";
import { interpolate, removeTSVariableDeclares } from "./util/ast";
import { Module, readFile } from "./util/module";
import { AppInfo } from "./types";

const PATH = "swagger.ts";

const swaggerTemplatePath = require.resolve("./swagger.template.ts");

export async function createSwagger(appInfo: AppInfo): Promise<Module> {
    const file = await readFile(swaggerTemplatePath);
    interpolate(file, {
        TITLE: builders.stringLiteral(appInfo.name),
        DESCRIPTION: builders.stringLiteral(appInfo.description),
        VERSION: builders.stringLiteral(appInfo.version),
    });
    removeTSVariableDeclares(file);
    return {
        code: print(file).code,
        path: PATH
    }
}