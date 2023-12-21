import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { rm } from "fs/promises";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";

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
          entities,
          roles,
          buildId: "example_build_id",
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
          resourceType: EnumResourceType.Service,
          pluginInstallations: [],
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
