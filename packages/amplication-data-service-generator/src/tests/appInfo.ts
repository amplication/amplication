import { AppInfo } from "@amplication/code-gen-types";
import { EnumAuthProviderType } from "../models";

export const MODULE_EXTENSIONS_TO_SNAPSHOT = [
  ".ts",
  ".tsx",
  ".prisma",
  ".env",
  ".yml",
];

export const appInfo: AppInfo = {
  name: "Sample Application",
  description: "Sample application for testing",
  version: "0.1.3",
  id: "ckl0ow1xj00763cjnch10k6mc",
  url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
  settings: {
    dbHost: "localhost",
    dbName: "db-name",
    dbPort: 5433,
    dbPassword: "1234",
    dbUser: "testUsername",
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
};
