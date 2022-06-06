import { AppInfo, Module } from "../../types";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";
import { register } from "@amplication/basic-auth-plugin";
// import child_process from "child_process";
import "reflect-metadata";
import { DsgContext } from "../../dsg-context";
import { CreateAuthHook, HookService } from "@amplication/generation-core/src/util/hooks";
import path from "path";


export async function createAuthModules(
  srcDir: string,
  appInfo: AppInfo,
  staticModules: Module[],
  appModule: Module
): Promise<Module[]> {

  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;
  const { settings } = appInfo;
  const { authProvider } = settings;

  //TODO: Move it to some other place
  // const pluginName = "@amplication/basic-auth-plugin";
  // child_process.execSync(`npm install ${pluginName}`, {stdio:[0,1,2]});
  // const authPlugin = await import(pluginName);
  // authPlugin.register(HookService.getInstance);

  register(HookService.getInstance);

  const ctx = DsgContext.getInstance;
  const createAuthHook = new CreateAuthHook(ctx, appModule, path.join(authDir, 'auth.module.ts'));
  HookService.getInstance.runHook(createAuthHook);
  // const modules = await authPlugin.createPluginModule(authDir);
  // authPlugin.updateStaticModules(staticModules, appModule, srcDir, authDir);
  return Promise.all([
    // defaultGuardFile,
    // ...modules,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
