import { EnumBuildStatus, BuildRequest } from "../types";
import {
  BuildImageOptions,
  createBuildImageOptions,
  DockerProvider,
} from "./DockerProvider";

const EXAMPLE_TAGS = ["EXAMPLE_REPOSITORY:EXAMPLE_TAG"];
const EXAMPLE_LOCAL_CODE_URL = `/example-directory/example-filename`;
const EXAMPLE_BUILD_ARGS = { EXAMPLE_KEY: "EXAMPLE_VALUE" };
const EXAMPLE_CACHE_FROM = ["EXAMPLE_CACHE_FROM_IMAGE"];
const EXAMPLE_BUILD_REQUEST: BuildRequest = {
  tags: EXAMPLE_TAGS,
  url: EXAMPLE_LOCAL_CODE_URL,
};
const EXAMPLE_BUILD_REQUEST_WITH_ARGS: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
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
      images: EXAMPLE_TAGS,
    });
    expect(dockerBuildImageMock).toBeCalledTimes(1);
    expect(dockerBuildImageMock).toBeCalledWith(EXAMPLE_LOCAL_CODE_URL, {
      t: EXAMPLE_TAGS,
    });
  });
});

describe("createBuildImageOptions", () => {
  const cases: Array<[string, BuildRequest, BuildImageOptions]> = [
    [
      "Basic request",
      EXAMPLE_BUILD_REQUEST,
      {
        t: EXAMPLE_TAGS,
      },
    ],
    [
      "With build args",
      EXAMPLE_BUILD_REQUEST_WITH_ARGS,
      {
        t: EXAMPLE_TAGS,
        buildargs: EXAMPLE_BUILD_ARGS,
      },
    ],
    [
      "With cache from",
      EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM,
      {
        t: EXAMPLE_TAGS,
        cachefrom: JSON.stringify(
          EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM.cacheFrom
        ),
      },
    ],
  ];
  test.each(cases)("%s", (name, request, expected) => {
    expect(createBuildImageOptions(request)).toEqual(expected);
  });
});
