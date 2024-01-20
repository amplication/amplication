import { MockedLogger } from "@amplication/util/logging/test-utils";
import { rm } from "fs/promises";
import { createDataService } from "../create-data-service";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { TEST_DATA } from "./test-data";

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

  describe("when server is disabled", () => {
    test("creates app as expected", async () => {
      const modules = await createDataService(
        {
          ...TEST_DATA,
          resourceInfo: {
            ...appInfo,
            settings: {
              ...appInfo.settings,
              serverSettings: {
                ...appInfo.settings.serverSettings,
                generateServer: false,
              },
            },
          },
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
