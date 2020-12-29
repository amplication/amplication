import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import {
  createConfig,
  IMAGE_REPOSITORY_SUBSTITUTION_KEY,
  IMAGE_TAG_SUBSTITUTION_KEY,
  DOCKER_PUSH_STEP,
  IMAGES,
  createBuildArgParameter,
  createBuildStep,
  createTags,
  createCacheFromParameter,
  TAG_BUILD_ARG,
  CLOUD_BUILDERS_DOCKER_IMAGE,
} from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_BUILD_ARG_NAME = "EXAMPLE_BUILD_ARG_NAME";
const EXAMPLE_BUILD_ARG_VALUE = "EXAMPLE_BUILD_ARG_VALUE";
const EXAMPLE_CACHE_FROM = "EXAMPLE_CACHE_FROM";
const EXAMPLE_BUILD_ARGS = {
  [EXAMPLE_BUILD_ARG_NAME]: EXAMPLE_BUILD_ARG_VALUE,
};
const EXAMPLE_BUILD_REQUEST: BuildRequest = {
  repository: EXAMPLE_REPOSITORY,
  tag: EXAMPLE_TAG,
  url: EXAMPLE_GCS_CODE_URL,
  args: EXAMPLE_BUILD_ARGS,
};
const EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
  cacheFrom: EXAMPLE_CACHE_FROM,
};

describe("createConfig", () => {
  test("creates config", () => {
    expect(createConfig(EXAMPLE_BUILD_REQUEST)).toEqual({
      steps: [createBuildStep(EXAMPLE_BUILD_REQUEST), DOCKER_PUSH_STEP],
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
      tags: createTags(EXAMPLE_REPOSITORY, EXAMPLE_TAG),
    });
  });
});

describe("createBuildStep", () => {
  const cases: Array<[
    string,
    BuildRequest,
    google.devtools.cloudbuild.v1.IBuildStep
  ]> = [
    [
      "Basic request",
      EXAMPLE_BUILD_REQUEST,
      {
        id: "docker-build",
        name: CLOUD_BUILDERS_DOCKER_IMAGE,
        args: [
          "build",
          TAG_BUILD_ARG,
          createBuildArgParameter(
            EXAMPLE_BUILD_ARG_NAME,
            EXAMPLE_BUILD_ARG_VALUE
          ),
          ".",
        ],
      },
    ],
    [
      "With cache from",
      EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM,
      {
        id: "docker-build",
        name: CLOUD_BUILDERS_DOCKER_IMAGE,
        args: [
          "build",
          TAG_BUILD_ARG,
          createBuildArgParameter(
            EXAMPLE_BUILD_ARG_NAME,
            EXAMPLE_BUILD_ARG_VALUE
          ),
          createCacheFromParameter(EXAMPLE_CACHE_FROM),
          ".",
        ],
      },
    ],
  ];
  test.each(cases)("%s", (name, request, expected) => {
    expect(createBuildStep(request)).toEqual(expected);
  });
});

describe("createBuildArgParameter", () => {
  test("creates build arg parameter", () => {
    expect(
      createBuildArgParameter(EXAMPLE_BUILD_ARG_NAME, EXAMPLE_BUILD_ARG_VALUE)
    ).toBe(`--build-arg=${EXAMPLE_BUILD_ARG_NAME}=${EXAMPLE_BUILD_ARG_VALUE}`);
  });
});
