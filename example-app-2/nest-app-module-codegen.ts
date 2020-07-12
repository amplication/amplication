import { ImportableModule, createModuleFromTemplate } from "./module.util";
import { removeExt } from "./path.util";

const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const APP_MODULE_PATH = "app.module.ts";

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
      return `import { ${module.exports[0]} } from "./${importPath}"`;
    })
    .join("\n");
  const modules = `[${nestModules
    .map((module) => module.exports[0])
    .join(", ")}]`;
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
