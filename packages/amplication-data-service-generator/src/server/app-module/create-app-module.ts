import { print } from "recast";
import { builders } from "ast-types";
import { Module } from "../../types";
import { readFile, relativeImportPath } from "../../util/module";
import {
  getExportedNames,
  interpolate,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeESLintComments,
  removeTSIgnoreComments,
  importDeclaration,
  callExpression,
} from "../../util/ast";
import { SRC_DIRECTORY } from "../constants";

const appModuleTemplatePath = require.resolve("./app.module.template.ts");
const MODULE_PATH = `${SRC_DIRECTORY}/app.module.ts`;
const MODULE_PATTERN = /\.module\.ts$/;
const MORGAN_MODULE_ID = builders.identifier("MorganModule");
const CONFIG_MODULE_ID = builders.identifier("ConfigModule");
const CONFIG_SERVICE_ID = builders.identifier("ConfigService");
const SERVE_STATIC_MODULE_ID = builders.identifier("ServeStaticModule");
const SERVE_STATIC_OPTIONS_SERVICE_ID = builders.identifier(
  "ServeStaticOptionsService"
);
const GRAPHQL_MODULE_ID = builders.identifier("GraphQLModule");

export async function createAppModule(
  resourceModules: Module[],
  staticModules: Module[]
): Promise<Module> {
  const nestModules = [
    ...resourceModules.filter((module) => module.path.match(MODULE_PATTERN)),
    ...staticModules.filter((module) => module.path.match(MODULE_PATTERN)),
  ];

  const nestModulesWithExports = nestModules.map((module) => ({
    module,
    exports: getExportedNames(module.code),
  }));
  const moduleImports = nestModulesWithExports.map(({ module, exports }) => {
    /** @todo explicitly check for "@Module" decorated classes */
    return importNames(
      // eslint-disable-next-line
      // @ts-ignore
      exports,
      relativeImportPath(MODULE_PATH, module.path)
    );
  });

  const nestModulesIds = nestModulesWithExports.flatMap(
    /** @todo explicitly check for "@Module" decorated classes */
    ({ exports }) => exports
  );
  const modules = builders.arrayExpression([
    ...nestModulesIds,
    MORGAN_MODULE_ID,
    callExpression`${CONFIG_MODULE_ID}.forRoot({ isGlobal: true })`,
    callExpression`${SERVE_STATIC_MODULE_ID}.forRootAsync({
      useClass: ${SERVE_STATIC_OPTIONS_SERVICE_ID}
    })`,
    callExpression`${GRAPHQL_MODULE_ID}.forRootAsync({
      useFactory: (configService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: true,
          playground,
          introspection: playground || introspection
        }
      },
      inject: [${CONFIG_SERVICE_ID}],
      imports: [${CONFIG_MODULE_ID}],
    })`,
  ]);

  const file = await readFile(appModuleTemplatePath);

  interpolate(file, {
    MODULES: modules,
  });

  addImports(file, [
    ...moduleImports,
    importDeclaration`import { ${MORGAN_MODULE_ID} } from "nest-morgan"`,
    importDeclaration`import { ${CONFIG_MODULE_ID}, ${CONFIG_SERVICE_ID} } from "@nestjs/config"`,
    importDeclaration`import { ${SERVE_STATIC_MODULE_ID} } from "@nestjs/serve-static"`,
    importDeclaration`import { ${SERVE_STATIC_OPTIONS_SERVICE_ID} } from "./serveStaticOptions.service"`,
    importDeclaration`import { ${GRAPHQL_MODULE_ID} } from "@nestjs/graphql"`,
  ]);
  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);

  return {
    path: MODULE_PATH,
    code: print(file).code,
  };
}
