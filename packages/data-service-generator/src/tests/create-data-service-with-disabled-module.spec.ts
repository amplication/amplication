import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { TEST_DATA } from "./test-data";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { rm } from "fs/promises";
import { moduleContainers } from "./modules";

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

  test("When a module is disabled", async () => {
    const firstModuleContainer = moduleContainers.shift();

    const moduleContainersWithDisabledModule = [
      {
        ...firstModuleContainer,
        enabled: false,
      },
      ...moduleContainers,
    ];

    const modules = await createDataService(
      {
        ...TEST_DATA,
        moduleContainers: [...moduleContainersWithDisabledModule],
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
