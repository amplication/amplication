import entities from "./entities";
import roles from "./roles";
import { AppInfo } from "@amplication/code-gen-types";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { EnumResourceType } from "../models";
import { createDataService } from "../create-data-service";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { rm } from "fs/promises";
import { plugins } from "./mock-data-plugin-installations";

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
          entities,
          buildId: "example_build_id",
          roles,
          resourceInfo: newAppInfo,
          resourceType: EnumResourceType.Service,
          pluginInstallations: [plugins.grpc],
          moduleActions: [],
          moduleContainers: [],
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
