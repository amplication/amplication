import { AppInfo, Module } from "../../types";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";
import { createPluginModule, updateStaticModules } from "@amplication/basic-auth-plugin";
import path from "path";

export async function createAuthModules(
  srcDir: string,
  appInfo: AppInfo,
  staticModules: Module[]
): Promise<Module[]> {
  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const modules = await createPluginModule(authDir);
  updateStaticModules(staticModules, authDir);
  return Promise.all([
    // defaultGuardFile,
    ...modules,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
