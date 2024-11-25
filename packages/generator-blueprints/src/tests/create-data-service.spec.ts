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

describe("createBlueprint", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });

  test("generate blueprint code as expected", async () => {
    const files = await createDataService(
      TEST_DATA,
      mockedLogger,
      temporaryPluginInstallationPath
    );

    const pathToCode: {
      [k: string]: any;
    } = {};

    for await (const file of files.getAll()) {
      pathToCode[file.path] = file.code;
    }

    expect(pathToCode).toMatchSnapshot();
  });
});
