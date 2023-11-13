import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { join } from "path";
import { AMPLICATION_MODULES } from "../generate-code";
import { USER_ENTITY_NAME } from "../server/user-entity/user-entity";

jest.setTimeout(100000);

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
          pluginInstallations: [
            {
              id: "auth-core",
              npm: "@amplication/plugin-auth-core",
              enabled: true,
              version: "latest",
              pluginId: "auth-core",
            },
            {
              id: "auth-jwt",
              npm: "@amplication/plugin-auth-jwt",
              enabled: true,
              version: "latest",
              pluginId: "auth-jwt",
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
