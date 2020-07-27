import { print } from "recast";
import { builders } from "ast-types";
import { Module, readFile, relativeImportPath } from "./util/module";
import {
  getExportedNames,
  interpolate,
  importNames,
  addImports,
  removeTSVariableDeclares,
} from "./util/ast";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const APP_MODULE_PATH = "app.module.ts";
const PRISMA_MODULE_PATH = "prisma/prisma.module.ts";

export async function createAppModule(
  resourceModules: Module[],
  staticModules: Module[]
): Promise<Module> {
  const prismaModule = staticModules.find(
    (module) => module.path === PRISMA_MODULE_PATH
  );

  if (!prismaModule) {
    throw new Error("Prisma module must be defined");
  }

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

  interpolate(file, {
    MODULES: modules,
  });

  addImports(file, moduleImports);
  removeTSVariableDeclares(file);

  return {
    path: APP_MODULE_PATH,
    code: print(file).code,
  };
}
