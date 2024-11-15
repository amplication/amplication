import { createDataService } from "../create-data-service";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { readFile, rm } from "fs/promises";
import { DSGResourceData } from "@amplication/code-gen-types";
import path from "path";
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

async function readInputJson(filePath: string): Promise<DSGResourceData> {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
}

describe("createDataService", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });

  test.each([
    "dotnet-sample-input",
    "template-with-custom-actions",
    "self-multiple-relations",
  ])("", async (testCase: string) => {
    const testData = await readInputJson(
      path.join(__dirname, "test-cases", `${testCase}.json`)
    );

    const files = await createDataService(
      testData,
      mockedLogger,
      temporaryPluginInstallationPath
    );

    const pathToCode = Object.fromEntries(
      Array.from(files.getAll()).map((file) => [
        file.path,
        file.code.toString(),
      ])
    );

    expect(pathToCode).toMatchSnapshot(testCase);
  });
});
