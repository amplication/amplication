import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { TEST_DATA } from "./test-data";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
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

  test("creates resource as expected", async () => {
    const modules = await createDataService(
      TEST_DATA,
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
