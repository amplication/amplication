import path from "path";
import { Module } from "./types/module";
import { readStaticModules } from './read-static-modules';
import { addImports, importNames, findFirstDecoratorByName, parse } from "./util/ast";
import { builders } from "ast-types";
import { relativeImportPath } from "./util/module";
import * as recast from "recast";


export async function createPluginModule(authPath: string): Promise<Module[]> {

  const modules = readStaticModules(path.join(__dirname, 'static'), authPath)
  
  return modules;
}

export function updateStaticModules(staticModules: Module[], authPath: string) {
  const authModulePath = path.join(authPath, 'auth.module.ts');
  const authModule = staticModules.find(module => module.path === authModulePath);
  if (authModule === undefined) {
    throw new TypeError('AuthModule does not exist.');
  }
  const basicStrategyIdentifier = builders.identifier(
    `BasicStrategy`
  );
  const authProviderImport = importNames(
    [basicStrategyIdentifier],
      `./basic/basic.strategy.ts`
  );
  const imports = [
    authProviderImport
  ]
  const authModuleFile = parse(authModule?.code)
  addImports(authModuleFile, imports)
  
  const moduleDecorator = findFirstDecoratorByName(authModuleFile, "Module")
  // recast.get(moduleDecorator)
  

  authModule.code = recast.print(authModuleFile).code
}