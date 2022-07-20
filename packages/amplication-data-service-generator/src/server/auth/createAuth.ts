import { AppInfo, Module } from "@amplication/code-gen-types";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

export async function createAuthModules(
  srcDir: string,
  appInfo: AppInfo
): Promise<Module[]> {
  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const defaultGuardFile = await createDefaultGuard(authProvider, authDir);
  return Promise.all([
    defaultGuardFile,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
