import { AppInfo } from "@amplication/code-gen-types";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { rm } from "fs/promises";
import { createDataService } from "../create-data-service";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { plugins } from "./mock-data-plugin-installations";
import { TEST_DATA } from "./test-data";

const newAppInfo: AppInfo = {
  ...appInfo,
  settings: {
    ...appInfo.settings,
    serverSettings: {
      generateGraphQL: false,
      generateRestApi: true,
      serverPath: "",
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

  describe("when grpc is enabled", () => {
    test("creates app as expected", async () => {
      const modules = await createDataService(
        {
          ...TEST_DATA,
          resourceInfo: newAppInfo,
          pluginInstallations: [plugins.grpc],
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
