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

  const pluginName = "amplication-basic-auth-plugin";
  child_process.execSync(`npm install ${pluginName}`, {stdio:[0,1,2]});
  const authPlugin = await import(pluginName);

  const modules = await authPlugin.createPluginModule(authDir);
  authPlugin.updateStaticModules(staticModules, appModule, srcDir, authDir);
  return Promise.all([
    // defaultGuardFile,
    ...modules,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
