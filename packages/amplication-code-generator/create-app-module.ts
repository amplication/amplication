import { print } from "recast";
import { builders } from "ast-types";
import {
  Module,
  createModuleFromTemplate,
  readCode,
  relativeImportPath,
} from "./util/module";
import { getExportedNames } from "./util/ast";

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
  const imports = nestModulesWithExports
    .map(({ module, exports }) => {
      /** @todo explicitly check for "@Module" decorated classes */
      const ast = builders.importDeclaration(
        [builders.importSpecifier(exports[0])],
        builders.stringLiteral(relativeImportPath(APP_MODULE_PATH, module.path))
      );
      // @ts-ignore
      return print(ast).code;
    })
    .join("\n");
  const modulesAst = builders.arrayExpression(
    nestModulesWithExports.map(({ exports }) => exports[0])
  );
  const modules = print(modulesAst).code;

  return createModuleFromTemplate(APP_MODULE_PATH, appModuleTemplatePath, {
    IMPORTS: imports,
    MODULES: modules,
  });
}
