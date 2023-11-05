import entities from "./entities";
import roles from "./roles";
import { AppInfo } from "@amplication/code-gen-types";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { EnumResourceType } from "../models";
import { createDataService } from "../create-data-service";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { join } from "path";
import { AMPLICATION_MODULES } from "../generate-code";

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

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("when grpc is enabled", () => {
    test("creates app as expected", async () => {
      const modules = await createDataService(
        {
          entities,
          buildId: "example_build_id",
          roles,
          resourceInfo: newAppInfo,
          resourceType: EnumResourceType.Service,
          pluginInstallations: [
            {
              id: "transport-grpc",
              npm: "@amplication/plugin-transport-grpc",
              enabled: true,
              version: "latest",
              pluginId: "transport-grpc",
              configurations: {
                generateGRPC: "true",
              },
            },
          ],
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
