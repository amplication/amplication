import { Buffer } from "buffer";
import getStream from "get-stream";
import { createConfig } from "./config";
import {
  GCPProvider,
  TERRAFORM_MAIN_FILE_NAME,
  TERRAFORM_VARIABLES_FILE_NAME,
} from "./GCPProvider";
import * as modules from "./modules";
import * as hashUtil from "./hash.util";
import { EnumDeployStatus } from "..";

const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_BUFFER = Buffer.from([]);
const EXAMPLE_CONFIGURATION = { terraform: { backend: {} }, module: {} };
const EXAMPLE_VARIABLES = { EXAMPLE_VARIABLE: "EXAMPLE_VARIABLE_VALUE" };
const EXAMPLE_BACKEND_CONFIGURATION = {
  EXAMPLE_BACKEND_CONFIGURATION_KEY: "EXAMPLE_BACKEND_CONFIGURATION_VALUE",
};
const EXAMPLE_GCS_BUILD_ID = "EXAMPLE_BUILD_ID";

const EXAMPLE_HASH = "EXAMPLE_HASH";
const EXAMPLE_ARCHIVE_FILE_NAME = `${EXAMPLE_HASH}.tar.gz`;
const EXAMPLE_FINISHED_CLOUD_BUILD_BUILD = {
  id: EXAMPLE_GCS_BUILD_ID,
};

const cloudBuildCreateBuildMock = jest.fn(() => [
  {
    metadata: { build: EXAMPLE_FINISHED_CLOUD_BUILD_BUILD },
  },
]);
const MOCK_CLOUD_BUILD_CLIENT = {
  createBuild: cloudBuildCreateBuildMock,
};
const storageFileSaveMock = jest.fn(() => Promise.resolve());
const storageBucketFileMock = jest.fn(() => ({
  save: storageFileSaveMock,
}));
const storageBucketMock = jest.fn(() => ({
  file: storageBucketFileMock,
}));
const MOCK_STORAGE = {
  bucket: storageBucketMock,
};

jest.mock("./modules");
const entryEndMock = jest.fn();
const packEntryMock = jest.fn(() => ({
  end: entryEndMock,
}));
const packPipeMock = jest.fn(function () {
  // @ts-ignore
  return this;
});
const EXAMPLE_PACK = {
  entry: packEntryMock,
  pipe: packPipeMock,
};
// @ts-ignore
modules.createTar.mockImplementation(() => EXAMPLE_PACK);

jest.mock("get-stream");
// @ts-ignore
getStream.buffer.mockImplementation(() => EXAMPLE_BUFFER);

jest.mock("./hash.util.ts");
// @ts-ignore
hashUtil.createHash.mockImplementation(() => EXAMPLE_HASH);

describe("GCPProvider", () => {
  test("deploys configuration to GCP", async () => {
    await expect(
      new GCPProvider(
        // @ts-ignore
        MOCK_CLOUD_BUILD_CLIENT,
        // @ts-ignore
        MOCK_STORAGE,
        EXAMPLE_PROJECT_ID,
        EXAMPLE_BUCKET
      ).deploy(
        EXAMPLE_CONFIGURATION,
        EXAMPLE_VARIABLES,
        EXAMPLE_BACKEND_CONFIGURATION
      )
    ).resolves.toEqual({
      status: EnumDeployStatus.Running,
      statusQuery: { id: EXAMPLE_GCS_BUILD_ID },
    });
    expect(cloudBuildCreateBuildMock).toBeCalledTimes(1);
    expect(cloudBuildCreateBuildMock).toBeCalledWith({
      projectId: EXAMPLE_PROJECT_ID,
      build: createConfig(
        EXAMPLE_BUCKET,
        EXAMPLE_ARCHIVE_FILE_NAME,
        EXAMPLE_BACKEND_CONFIGURATION,
        EXAMPLE_VARIABLES
      ),
    });
    expect(storageFileSaveMock).toBeCalledTimes(1);
    expect(storageFileSaveMock).toBeCalledWith(EXAMPLE_BUFFER);
    expect(storageBucketFileMock).toBeCalledTimes(1);
    expect(storageBucketFileMock).toBeCalledWith(EXAMPLE_ARCHIVE_FILE_NAME);
    expect(storageBucketMock).toBeCalledTimes(1);
    expect(storageBucketMock).toBeCalledWith(EXAMPLE_BUCKET);
    expect(getStream.buffer).toBeCalledTimes(1);
    expect(getStream.buffer).toBeCalledWith(EXAMPLE_PACK);
    expect(hashUtil.createHash).toBeCalledTimes(1);
    expect(hashUtil.createHash).toBeCalledWith(EXAMPLE_PACK);
    expect(modules.createTar).toBeCalledTimes(1);
    expect(modules.createTar).toBeCalledWith();
    expect(entryEndMock).toBeCalledTimes(2);
    expect(entryEndMock.mock.calls).toEqual([[], []]);
    expect(packEntryMock).toBeCalledTimes(2);
    expect(packEntryMock.mock.calls).toEqual([
      [
        { name: TERRAFORM_MAIN_FILE_NAME },
        JSON.stringify(EXAMPLE_CONFIGURATION),
      ],
      [
        { name: TERRAFORM_VARIABLES_FILE_NAME },
        JSON.stringify(EXAMPLE_VARIABLES),
      ],
    ]);
  });
});
