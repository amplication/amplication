import {
  createConfig,
  IMAGE_REPOSITORY_SUBSTITUTION_KEY,
  IMAGE_TAG_SUBSTITUTION_KEY,
  DOCKER_PULL_STEP,
  DOCKER_PUSH_STEP,
  DOCKER_PUSH_LATEST_STEP,
  IMAGES,
  createBuildArgParameter,
  createBuildStep,
} from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_BUILD_ARG_NAME = "EXAMPLE_BUILD_ARG_NAME";
const EXAMPLE_BUILD_ARG_VALUE = "EXAMPLE_BUILD_ARG_VALUE";
const EXAMPLE_BUILD_ARGS = {
  [EXAMPLE_BUILD_ARG_NAME]: EXAMPLE_BUILD_ARG_VALUE,
};

describe("createConfig", () => {
  test("creates config", () => {
    expect(
      createConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL,
        EXAMPLE_BUILD_ARGS
      )
    ).toEqual({
      steps: [
        DOCKER_PULL_STEP,
        createBuildStep([
          createBuildArgParameter(
            EXAMPLE_BUILD_ARG_NAME,
            EXAMPLE_BUILD_ARG_VALUE
          ),
        ]),
        DOCKER_PUSH_STEP,
        DOCKER_PUSH_LATEST_STEP,
      ],
      images: IMAGES,
      source: {
        storageSource: {
          bucket: EXAMPLE_BUCKET,
          object: EXAMPLE_OBJECT,
        },
      },
      substitutions: {
        /** @todo use a nicer repository name */
        [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: EXAMPLE_REPOSITORY,
        [IMAGE_TAG_SUBSTITUTION_KEY]: EXAMPLE_TAG,
      },
    });
  });
});

describe("createBuildArgParameter", () => {
  test("creates build arg parameter", () => {
    expect(
      createBuildArgParameter(EXAMPLE_BUILD_ARG_NAME, EXAMPLE_BUILD_ARG_VALUE)
    ).toBe(
      `--build-arg=${EXAMPLE_BUILD_ARG_NAME}="${EXAMPLE_BUILD_ARG_VALUE}"`
    );
  });
});
