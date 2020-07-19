import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module, readCode, relativeImportPath } from "./util/module";
import {
  getExportedNames,
  parse,
  interpolateAST,
  getImportDeclarations,
  getLastStatementFromFile,
} from "./util/ast";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const prismaModuleTemplatePath = require.resolve(
  "./templates/prisma/prisma.module.ts"
);
const APP_MODULE_PATH = "app.module.ts";
const PRISMA_MODULE_PATH = "prisma/prisma.module.ts";

export async function createAppModule(
  resourceModules: Module[]
): Promise<Module> {
  const prismaModule: Module = {
    code: await readCode(prismaModuleTemplatePath),
    path: PRISMA_MODULE_PATH,
  };
  const nestModules = resourceModules
    .filter((module) => module.path.includes(".module."))
    .concat([prismaModule]);
  const nestModulesWithExports = nestModules.map((module) => ({
    module,
    exports: getExportedNames(module.code),
  }));
  const moduleImports = nestModulesWithExports.map(({ module, exports }) => {
    /** @todo explicitly check for "@Module" decorated classes */
    return builders.importDeclaration(
      [builders.importSpecifier(exports[0])],
      builders.stringLiteral(relativeImportPath(APP_MODULE_PATH, module.path))
    );
  });
  const modules = builders.arrayExpression(
    nestModulesWithExports.map(({ exports }) => exports[0])
  );

  const template = await readCode(appModuleTemplatePath);
  const ast = parse(template) as namedTypes.File;

  interpolateAST(ast, {
    MODULES: modules,
  });

  const imports = getImportDeclarations(ast);
  const moduleClass = getLastStatementFromFile(
    ast
  ) as namedTypes.ExportNamedDeclaration;

  const nextAst = builders.program([...imports, ...moduleImports, moduleClass]);

  return {
    path: APP_MODULE_PATH,
    code: print(nextAst).code,
  };
}
