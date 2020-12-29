import { EnumBuildStatus } from "../types";
import { createImageID, DockerProvider } from "./DockerProvider";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_LOCAL_CODE_URL = `/example-directory/example-filename`;
const EXAMPLE_LOCAL_IMAGES = [createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG)];
const EXAMPLE_BUILD_ARGS = { EXAMPLE_KEY: "EXAMPLE_VALUE" };

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
      ).build({
        repository: EXAMPLE_REPOSITORY,
        tag: EXAMPLE_TAG,
        url: EXAMPLE_LOCAL_CODE_URL,
        args: EXAMPLE_BUILD_ARGS,
      })
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
