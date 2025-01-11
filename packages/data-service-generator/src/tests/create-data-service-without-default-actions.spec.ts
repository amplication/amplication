import { MockedLogger } from "@amplication/util/logging/test-utils";
import { rm } from "fs/promises";
import { createDataService } from "../create-data-service";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { customActions, defaultActions } from "./modules";
import { TEST_DATA } from "./test-data";

jest.setTimeout(100000);

const temporaryPluginInstallationPath =
  getTemporaryPluginInstallationPath(__filename);

describe("when all default actions are disabled", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });

  test("creates resource as expected", async () => {
    const modules = await createDataService(
      {
        ...TEST_DATA,
        moduleActions: [
          ...defaultActions.map((action) => ({
            ...action,
            enabled: false,
          })),
          ...customActions,
        ],
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
