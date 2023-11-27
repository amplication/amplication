import { AppInfo } from "@amplication/code-gen-types";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import { installedPlugins } from "./pluginInstallation";
import roles from "./roles";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { rm } from "fs/promises";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";

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

const temporaryPluginInstallationPath =
  getTemporaryPluginInstallationPath(__filename);

describe("createDataService", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });
  describe("when server and admin are configured with custom path", () => {
    test("creates app as expected", async () => {
      const modules = await createDataService(
        {
          entities,
          buildId: "example_build_id",
          roles,
          resourceInfo: newAppInfo,
          resourceType: EnumResourceType.Service,
          pluginInstallations: installedPlugins,
        },
        MockedLogger,
        temporaryPluginInstallationPath
      );

      const modulesToSnapshot = modules
        .modules()
        .filter((module) =>
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
});
