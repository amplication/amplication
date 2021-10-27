import { AppInfo, Module } from "../../types";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenService } from "./token/createTokenService";

export async function createAuthModules(
  srcDir: string,
  appInfo: AppInfo
): Promise<Module[]> {
  const authDir = `${srcDir}/auth`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const defaultGuardFile = await createDefaultGuard(authProvider);
  return Promise.all([
    defaultGuardFile,
    createTokenService(authDir, authProvider),
  ]);
}
