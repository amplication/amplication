import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { USER_ENTITY_NAME } from "../server/user-entity/user-entity";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import entities from "./entities";
import { plugins } from "./mock-data-plugin-installations";
import roles from "./roles";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { rm } from "fs/promises";

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
  describe("when auth-jwt plugin is installed", () => {
    test("creates resource as expected", async () => {
      const modules = await createDataService(
        {
          entities,
          roles,
          buildId: "example_build_id",
          resourceInfo: {
            ...appInfo,
            settings: {
              ...appInfo.settings,
              authEntityName: USER_ENTITY_NAME,
            },
          },
          resourceType: EnumResourceType.Service,
          pluginInstallations: [plugins.authCore, plugins.authJwt],
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
