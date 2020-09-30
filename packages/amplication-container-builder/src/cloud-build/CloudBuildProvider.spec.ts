import { CloudBuildProvider } from "./CloudBuildProvider";
import { createConfig } from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_GCR_IMAGES = [`gcr.io/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`];
const EXAMPLE_FINISHED_CLOUD_BUILD_BUILD = {
  images: EXAMPLE_GCR_IMAGES,
};

const cloudBuildBuildPromiseMock = jest.fn(() => [
  EXAMPLE_FINISHED_CLOUD_BUILD_BUILD,
]);
const cloudBuildCreateBuildMock = jest.fn(() => [
  {
    promise: cloudBuildBuildPromiseMock,
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
      ).build(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_GCS_CODE_URL)
    ).resolves.toEqual({ images: EXAMPLE_GCR_IMAGES });
    expect(cloudBuildCreateBuildMock).toBeCalledTimes(1);
    expect(cloudBuildCreateBuildMock).toBeCalledWith({
      projectId: EXAMPLE_PROJECT_ID,
      build: createConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL
      ),
    });
    expect(cloudBuildBuildPromiseMock).toBeCalledTimes(1);
    expect(cloudBuildBuildPromiseMock).toBeCalledWith();
  });
});
