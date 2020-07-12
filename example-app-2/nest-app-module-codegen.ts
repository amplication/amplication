import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { ImportableModule, createModuleFromTemplate } from "./module.util";
import { removeExt } from "./path.util";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const APP_MODULE_PATH = "app.module.ts";

const buildImport = template("import { %%name%% } from %%module%%");

export async function createAppModule(
  resourceModules: ImportableModule[]
): Promise<ImportableModule> {
  const prismaModule: ImportableModule = {
    code: "",
    exports: ["PrismaModule"],
    path: "prisma/prisma.module.ts",
  };
  const nestModules = resourceModules
    .filter((module) => module.path.includes(".module."))
    .concat([prismaModule]);
  const imports = nestModules
    .map((module) => {
      const importPath = removeExt(module.path);
      const ast = buildImport({
        name: t.identifier(module.exports[0]),
        module: "./" + importPath,
      });
      // @ts-ignore
      return generate(ast).code;
    })
    .join("\n");
  const modulesAst = t.arrayExpression(
    nestModules.map((module) => t.identifier(module.exports[0]))
  );
  const modules = generate(modulesAst).code;

  return createModuleFromTemplate(
    APP_MODULE_PATH,
    appModuleTemplatePath,
    {
      IMPORTS: imports,
      MODULES: modules,
    },
    []
  );
}
