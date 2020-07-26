import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module, readFile, relativeImportPath } from "./util/module";
import {
  getExportedNames,
  interpolateAST,
  getImportDeclarations,
  getLastStatementFromFile,
  importNames,
} from "./util/ast";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const prismaModuleTemplatePath = require.resolve(
  "./static/prisma/prisma.module.ts"
);
const APP_MODULE_PATH = "app.module.ts";
const PRISMA_MODULE_PATH = "prisma/prisma.module.ts";

export async function createAppModule(
  resourceModules: Module[]
): Promise<Module> {
  const prismaModule: Module = {
    code: print(await readFile(prismaModuleTemplatePath)).code,
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
    return importNames(
      // @ts-ignore
      exports,
      relativeImportPath(APP_MODULE_PATH, module.path)
    );
  });
  const modules = builders.arrayExpression(
    nestModulesWithExports.map(({ exports }) => exports[0])
  );

  const file = await readFile(appModuleTemplatePath);

  interpolateAST(file, {
    MODULES: modules,
  });

  const imports = getImportDeclarations(file);
  const moduleClass = getLastStatementFromFile(
    file
  ) as namedTypes.ExportNamedDeclaration;

  const nextAst = builders.program([...imports, ...moduleImports, moduleClass]);

  return {
    path: APP_MODULE_PATH,
    code: print(nextAst).code,
  };
}
