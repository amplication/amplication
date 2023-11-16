import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import { installedPlugins } from "./pluginInstallation";
import roles from "./roles";
import { join } from "path";
import { AMPLICATION_MODULES } from "../generate-code";

jest.setTimeout(100000);

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
          pluginInstallations: installedPlugins,
        },
        MockedLogger,
        join(__dirname, "../../", AMPLICATION_MODULES)
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
