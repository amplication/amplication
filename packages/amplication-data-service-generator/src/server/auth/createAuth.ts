import { AppInfo, Module } from "../../types";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";
// import { createPluginModule, updateStaticModules } from "@amplication/basic-auth-plugin";
import child_process from "child_process";

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

  child_process.execSync('npm install https://github.com/amplication/basic-auth-plugin.git', {stdio:[0,1,2]});
  const pluginLink = "@amplication/basic-auth-plugin";
  const authPlugin = await import(pluginLink);
  // authPlugin.default();

  const modules = await authPlugin.createPluginModule(authDir);
  authPlugin.updateStaticModules(staticModules, appModule, srcDir, authDir);
  return Promise.all([
    // defaultGuardFile,
    ...modules,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
