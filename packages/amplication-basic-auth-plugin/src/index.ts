import path from "path";
import { Module } from "./types/module";
import { readStaticModules } from './read-static-modules';
import { addImports, importNames, parse, pushIdentifierToModuleSection } from "./util/ast";
import { builders, namedTypes } from "ast-types";
import { relativeImportPath } from "./util/module";
import { types, visit, print } from "recast";

const nt = types.namedTypes;

export async function createPluginModule(authPath: string): Promise<Module[]> {

  const modules = readStaticModules(path.join(__dirname, 'static'), authPath)
  
  return modules;
}

export function updateStaticModules(staticModules: Module[], appModule: Module, srcDir: string, authDir: string) {
  const authModulePath = path.join(authDir, 'auth.module.ts');
  const authModule = staticModules.find(module => module.path === authModulePath);
  if (authModule === undefined) {
    throw new TypeError('AuthModule does not exist.');
  }
  const basicStrategyIdentifier = builders.identifier(
    `BasicStrategy`
  );
  const basicStrategyImport = importNames(
    [basicStrategyIdentifier],
      `./basic/basic.strategy`
  );
  const imports = [
    basicStrategyImport
  ]
  const authModuleFile = parse(authModule?.code)
  addImports(authModuleFile, imports)
  
  pushIdentifierToModuleSection(authModuleFile, "providers", basicStrategyIdentifier)

  authModule.code = print(authModuleFile).code

  // const appModulePath = path.join(srcDir, 'app.module.ts');
  // const appModule = staticModules.find(module => module.path === appModulePath);
  if (appModule === undefined) {
    throw new TypeError('AppModule does not exist.');
  }
  const appModuleFile = parse(appModule?.code);

  const basicStrategyImportFromAuthModule = importNames(
    [basicStrategyIdentifier],
    `./auth/auth.module`
  );
  const appModuleImports = [
    basicStrategyImportFromAuthModule
  ]
  addImports(appModuleFile, appModuleImports);

  pushIdentifierToModuleSection(appModuleFile, "imports", basicStrategyIdentifier)

  appModule.code = print(appModuleFile).code
}