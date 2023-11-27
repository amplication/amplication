import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { join } from "path";
import { AMPLICATION_MODULES } from "../generate-code";

jest.setTimeout(100000);

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when admin-ui is disabled", () => {
    test("creates app as expected", async () => {
      const modules = await createDataService(
        {
          moduleContainers: [],
          moduleActions: [],
          entities,
          roles,
          buildId: "example_build_id",
          resourceInfo: {
            ...appInfo,
            settings: {
              ...appInfo.settings,
              adminUISettings: {
                ...appInfo.settings.adminUISettings,
                generateAdminUI: false,
              },
            },
          },
          resourceType: EnumResourceType.Service,
          pluginInstallations: [],
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
