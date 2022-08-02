import winston from "winston";
import { Module, AppInfo } from "@amplication/code-gen-types";
import { createDotEnvModule } from "./create-dotenv";

export async function createRootModules(
  appInfo: AppInfo,
  logger: winston.Logger
): Promise<Module[]> {
  return [await createDotEnvModule(appInfo)];
}
