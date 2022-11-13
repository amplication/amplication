import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import { AppInfo } from "@amplication/code-gen-types";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { EnumResourceType } from "../models";
import { installedPlugins } from "./pluginInstallation";

const newAppInfo: AppInfo = {
  ...appInfo,
  settings: {
    ...appInfo.settings,
    serverSettings: {
      generateGraphQL: true,
      generateRestApi: true,
      serverPath: "test",
    },
    adminUISettings: {
      generateAdminUI: true,
      adminUIPath: "test-ui",
    },
  },
};

jest.setTimeout(100000);

jest.mock("./create-log", () => ({
  createLog: jest.fn(),
}));

describe("createDataService", () => {
  test("creates app as expected", async () => {
    const modules = await createDataService({
      entities,
      roles,
      resourceInfo: newAppInfo,
      resourceType: EnumResourceType.Service,
      pluginInstallations: installedPlugins,
    });

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
