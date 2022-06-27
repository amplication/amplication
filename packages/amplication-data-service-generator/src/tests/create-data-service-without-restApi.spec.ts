import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import { AppInfo } from "../types";
import { EnumAuthProviderType } from "../models";

const MODULE_EXTENSIONS_TO_SNAPSHOT = [
  ".ts",
  ".tsx",
  ".prisma",
  ".env",
  ".yml",
];

const appInfo: AppInfo = {
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
      generateRestApi: false,
      serverPath: "",
    },
    adminUISettings: {
      generateAdminUI: true,
      adminUIPath: "",
    },
  },
}

jest.setTimeout(100000);

describe("createDataService", () => {
  test("creates app as expected", async () => {
    const modules = await createDataService(entities, roles, appInfo);
    const modulesToSnapshot = modules.filter((module) =>
      MODULE_EXTENSIONS_TO_SNAPSHOT.some((extension) =>
        module.path.endsWith(extension)
      )
    );
    const pathToCode = Object.fromEntries(
      modulesToSnapshot.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
