import { AppInfo, Module } from "../../types";
import { createRaAuthProvider } from "./createRaAuthProvider";

export async function createAuthModules(appInfo: AppInfo): Promise<Module[]> {
  const { settings } = appInfo;
  const { authProvider } = settings;
  const raAuthModule = await createRaAuthProvider(authProvider);
  return [raAuthModule];
}
