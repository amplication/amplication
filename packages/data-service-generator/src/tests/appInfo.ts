import { AppInfo } from "@amplication/code-gen-types";
import { EnumAuthProviderType } from "../models";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";

export const MODULE_EXTENSIONS_TO_SNAPSHOT = [
  ".ts",
  ".tsx",
  ".prisma",
  ".env",
  ".yml",
  ".json",
  ".gitignore",
];

export const appInfo: AppInfo = {
  name: "Sample Application",
  description: "Sample application for testing",
  version: "0.1.3",
  id: "ckl0ow1xj00763cjnch10k6mc",
  url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
  settings: {
    authProvider: EnumAuthProviderType.Http,
    serverSettings: {
      generateGraphQL: true,
      generateRestApi: true,
      serverPath: "",
    },
    adminUISettings: {
      generateAdminUI: true,
      adminUIPath: "",
    },
  },
  codeGeneratorVersionOptions: {
    codeGeneratorVersion: null,
    codeGeneratorStrategy: CodeGeneratorVersionStrategy.LatestMajor,
  },
};
