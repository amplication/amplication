import { createImageID, DockerProvider } from "./DockerProvider";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_LOCAL_CODE_URL = `/example-directory/example-filename`;
const EXAMPLE_LOCAL_IMAGES = [createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG)];

const dockerBuildImageMock = jest.fn();

const MOCK_DOCKER = {
  buildImage: dockerBuildImageMock,
};

describe("DockerProvider", () => {
  test("builds docker image using local docker server", async () => {
    await expect(
      // @ts-ignore
      new DockerProvider(MOCK_DOCKER).build(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_LOCAL_CODE_URL
      )
    ).resolves.toEqual({ images: EXAMPLE_LOCAL_IMAGES });
    expect(dockerBuildImageMock).toBeCalledTimes(1);
    expect(dockerBuildImageMock).toBeCalledWith(EXAMPLE_LOCAL_CODE_URL, {
      t: createImageID(EXAMPLE_REPOSITORY, EXAMPLE_TAG),
    });
  });
});
