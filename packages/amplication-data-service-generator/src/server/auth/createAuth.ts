import { AppInfo, Module } from "../../types";
import { SRC_DIRECTORY } from "../constants";
import { createDefaultGuard } from "./guards/createDefaultGuard";

export const authPath = `${SRC_DIRECTORY}/auth`;

export async function createAuthModules(appInfo: AppInfo): Promise<Module[]> {
  const { settings } = appInfo;
  const { authProvider } = settings;
  const defaultGuardFile = await createDefaultGuard(authProvider);
  return [defaultGuardFile];
}
