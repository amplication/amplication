import { AppInfo, Module } from "../../types";
import { createDefaultGuard } from "./guards/createDefaultGuard";

export async function createAuthModules(appInfo: AppInfo): Promise<Module[]> {
  const { settings } = appInfo;
  const { authProvider } = settings;
  const defaultGuardFile = await createDefaultGuard(authProvider);
  return [defaultGuardFile];
}
