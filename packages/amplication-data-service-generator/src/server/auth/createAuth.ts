import * as path from "path";
import { AppInfo, Module } from "@amplication/code-gen-types";
import { readStaticModules } from "../../read-static-modules";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");

export async function createAuthModules(
  srcDir: string,
  appInfo: AppInfo
): Promise<Module[]> {
  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;
  const { settings } = appInfo;
  const { authProvider } = settings;
  
  const staticModules = await readStaticModules(
    STATIC_DIRECTORY,
    srcDir
  );

  const defaultGuardFile = await createDefaultGuard(authProvider, authDir);
  return Promise.all([
    ...staticModules,
    defaultGuardFile,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
