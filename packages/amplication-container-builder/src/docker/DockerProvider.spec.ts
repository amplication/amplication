import { EnumBuildStatus, BuildRequest } from "../types";
import {
  BuildImageOptions,
  createBuildImageOptions,
  createImageID,
  DockerProvider,
} from "./DockerProvider";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_LOCAL_CODE_URL = `/example-directory/example-filename`;
const EXAMPLE_LOCAL_IMAGES = [createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG)];
const EXAMPLE_BUILD_ARGS = { EXAMPLE_KEY: "EXAMPLE_VALUE" };
const EXAMPLE_CACHE_FROM = "EXAMPLE_CACHE_FROM";
const EXAMPLE_BUILD_IMAGE = createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG);
const EXAMPLE_BUILD_REQUEST: BuildRequest = {
  repository: EXAMPLE_REPOSITORY,
  tag: EXAMPLE_TAG,
  url: EXAMPLE_LOCAL_CODE_URL,
  args: EXAMPLE_BUILD_ARGS,
};
const EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
  cacheFrom: EXAMPLE_CACHE_FROM,
};

const dockerBuildImageMock = jest.fn();

const MOCK_DOCKER = {
  buildImage: dockerBuildImageMock,
};

describe("DockerProvider", () => {
  test("builds docker image using local docker server", async () => {
    await expect(
      new DockerProvider(
        // @ts-ignore
        MOCK_DOCKER
      ).build(EXAMPLE_BUILD_REQUEST)
    ).resolves.toEqual({
      status: EnumBuildStatus.Completed,
      images: EXAMPLE_LOCAL_IMAGES,
    });
    expect(dockerBuildImageMock).toBeCalledTimes(1);
    expect(dockerBuildImageMock).toBeCalledWith(EXAMPLE_LOCAL_CODE_URL, {
      t: createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG),
      buildargs: EXAMPLE_BUILD_ARGS,
    });
  });
});

describe("createBuildImageOptions", () => {
  const cases: Array<[string, BuildRequest, string, BuildImageOptions]> = [
    [
      "Basic request",
      EXAMPLE_BUILD_REQUEST,
      EXAMPLE_BUILD_IMAGE,
      {
        t: EXAMPLE_BUILD_IMAGE,
        buildargs: EXAMPLE_BUILD_REQUEST.args,
      },
    ],
    [
      "With cache from",
      EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM,
      EXAMPLE_BUILD_IMAGE,
      {
        t: EXAMPLE_BUILD_IMAGE,
        buildargs: EXAMPLE_BUILD_REQUEST.args,
        cachefrom: EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM.cacheFrom,
      },
    ],
  ];
  test.each(cases)("%s", (name, request, imageId, expected) => {
    expect(createBuildImageOptions(request, imageId)).toEqual(expected);
  });
});
