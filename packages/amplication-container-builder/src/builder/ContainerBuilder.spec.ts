import { BuildRequest, BuildResult, EnumBuildStatus } from "../types";
import { ContainerBuilder } from "./ContainerBuilder";
import { InvalidDefaultError } from "./InvalidDefaultError";

const EXAMPLE_PROVIDER_NAME = "example";
const INVALID_DEFAULT = "INVALID_DEFAULT";
const EXAMPLE_TAG = "EXAMPLE_REPOSITORY:EXAMPLE_TAG";
const EXAMPLE_TAGS = [EXAMPLE_TAG];
const EXAMPLE_CODE_URL = "EXAMPLE_CODE_URL";
const EXAMPLE_BUILD_REQUEST: BuildRequest = {
  tags: EXAMPLE_TAGS,
  url: EXAMPLE_CODE_URL,
};
const EXAMPLE_BUILD_RESULT: BuildResult = {
  images: ["EXAMPLE_IMAGE_ID"],
  status: EnumBuildStatus.Completed,
};

const EXAMPLE_SYNC_PROVIDER = {
  build: jest.fn(async (request: BuildRequest) => EXAMPLE_BUILD_RESULT),
  getStatus: jest.fn(async (statusQuery: any) => EXAMPLE_BUILD_RESULT),
  createImageId: jest.fn((tag) => tag),
};

const EXAMPLE_ASYNC_PROVIDER = Promise.resolve(EXAMPLE_SYNC_PROVIDER);

describe("ContainerBuilder", () => {
  test("builds using a sync provider", async () => {
    await expect(
      new ContainerBuilder({
        default: EXAMPLE_PROVIDER_NAME,
        providers: {
          [EXAMPLE_PROVIDER_NAME]: EXAMPLE_SYNC_PROVIDER,
        },
      }).build(EXAMPLE_BUILD_REQUEST)
    ).resolves.toEqual(EXAMPLE_BUILD_RESULT);
  });
  test("builds using an async provider", async () => {
    await expect(
      new ContainerBuilder({
        default: EXAMPLE_PROVIDER_NAME,
        providers: {
          [EXAMPLE_PROVIDER_NAME]: EXAMPLE_ASYNC_PROVIDER,
        },
      }).build(EXAMPLE_BUILD_REQUEST)
    ).resolves.toEqual(EXAMPLE_BUILD_RESULT);
  });
  test("throws an error for invalid default", () => {
    expect(
      () =>
        new ContainerBuilder({
          default: INVALID_DEFAULT,
          providers: {
            [EXAMPLE_PROVIDER_NAME]: EXAMPLE_SYNC_PROVIDER,
          },
        })
    ).toThrow(new InvalidDefaultError(INVALID_DEFAULT));
  });
  test("creates image id", () => {
    expect(
      new ContainerBuilder({
        default: EXAMPLE_PROVIDER_NAME,
        providers: {
          [EXAMPLE_PROVIDER_NAME]: EXAMPLE_SYNC_PROVIDER,
        },
      }).createImageId(EXAMPLE_TAG)
    ).resolves.toEqual(EXAMPLE_TAG);
  });
});
