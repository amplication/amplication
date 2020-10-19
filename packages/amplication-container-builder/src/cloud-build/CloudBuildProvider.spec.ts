import { EnumBuildStatus } from "../types";
import { CloudBuildProvider } from "./CloudBuildProvider";
import { createConfig } from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_BUILD_ID = "EXAMPLE_BUILD_ID";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_GCR_IMAGES = [`gcr.io/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`];
const EXAMPLE_BUILD_ARGS = {
  EXAMPLE_KEY: "EXAMPLE_VALUE",
};
const EXAMPLE_FINISHED_CLOUD_BUILD_BUILD = {
  id: EXAMPLE_GCS_BUILD_ID,
  images: EXAMPLE_GCR_IMAGES,
};

// const cloudBuildBuildPromiseMock = jest.fn(() => [
//   EXAMPLE_FINISHED_CLOUD_BUILD_BUILD,
// ]);
const cloudBuildCreateBuildMock = jest.fn(() => [
  {
    metadata: { build: EXAMPLE_FINISHED_CLOUD_BUILD_BUILD },
  },
]);
const MOCK_CLOUD_BUILD_CLIENT = {
  createBuild: cloudBuildCreateBuildMock,
};

describe("CloudBuildProvider", () => {
  test("builds docker image using google cloud build", async () => {
    await expect(
      new CloudBuildProvider(
        // @ts-ignore
        MOCK_CLOUD_BUILD_CLIENT,
        EXAMPLE_PROJECT_ID
      ).build(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL,
        EXAMPLE_BUILD_ARGS
      )
    ).resolves.toEqual({
      status: EnumBuildStatus.Running,
      statusQuery: { id: EXAMPLE_GCS_BUILD_ID },
    });
    expect(cloudBuildCreateBuildMock).toBeCalledTimes(1);
    expect(cloudBuildCreateBuildMock).toBeCalledWith({
      projectId: EXAMPLE_PROJECT_ID,
      build: createConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL,
        EXAMPLE_BUILD_ARGS
      ),
    });
    // expect(cloudBuildBuildPromiseMock).toBeCalledTimes(1);
    // expect(cloudBuildBuildPromiseMock).toBeCalledWith();
  });
});
