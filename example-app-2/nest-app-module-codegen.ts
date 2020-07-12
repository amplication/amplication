import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";
import {
  Module,
  createModuleFromTemplate,
  getExportedNames,
  readCode,
} from "./module.util";
import { removeExt } from "./path.util";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const prismaModuleTemplatePath = require.resolve(
  "./templates/prisma/prisma.module.ts"
);
const APP_MODULE_PATH = "app.module.ts";
const PRISMA_MODULE_PATH = "prisma/prisma.module.ts";

const buildImport = template("import { %%name%% } from %%module%%");

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
  const imports = nestModulesWithExports
    .map(({ module, exports }) => {
      const importPath = removeExt(module.path);
      const ast = buildImport({
        /** @todo explicitly check for "@Module" decorated classes */
        name: t.identifier(exports[0]),
        module: "./" + importPath,
      });
      // @ts-ignore
      return generate(ast).code;
    })
    .join("\n");
  const modulesAst = t.arrayExpression(
    nestModulesWithExports.map(({ exports }) => t.identifier(exports[0]))
  );
  const modules = generate(modulesAst).code;

  return createModuleFromTemplate(APP_MODULE_PATH, appModuleTemplatePath, {
    IMPORTS: imports,
    MODULES: modules,
  });
}
