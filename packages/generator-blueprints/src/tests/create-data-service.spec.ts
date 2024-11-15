import { createDataService } from "../create-data-service";
import { TEST_DATA } from "./test-data";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { rm } from "fs/promises";
import { ILogger } from "@amplication/util-logging";

jest.setTimeout(100000);

const temporaryPluginInstallationPath =
  getTemporaryPluginInstallationPath(__filename);

export const mockedLogger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(() => mockedLogger),
};

describe("createDataService", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });

  test("creates resource as expected", async () => {
    const files = await createDataService(
      TEST_DATA,
      mockedLogger,
      temporaryPluginInstallationPath
    );

    const pathToCode: {
      [k: string]: any;
    } = [];

    for await (const file of files.getAll()) {
      pathToCode[file.path] = file.code;
    }

    console.log(pathToCode);

    // const modulesToSnapshot = modules
    //   .modules()
    //   .filter((module) =>
    //     MODULE_EXTENSIONS_TO_SNAPSHOT.some((extension) =>
    //       module.path.endsWith(extension)
    //     )
    //   );
    // const pathToCode = Object.fromEntries(
    //   modulesToSnapshot.map((module) => [module.path, module.code])
    // );
    expect(pathToCode).toMatchSnapshot();
  });
});
