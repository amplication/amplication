import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import {
  createConfig,
  createBuildArgParameter,
  createBuildStep,
  createBuildTags,
  createCacheFromParameter,
  CLOUD_BUILDERS_DOCKER_IMAGE,
  createTagParameter,
  createImage,
  createPushStep,
} from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_TAG = "EXAMPLE_REPOSITORY:EXAMPLE_TAG";
const EXAMPLE_TAGS = [EXAMPLE_TAG];
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
  tags: EXAMPLE_TAGS,
  url: EXAMPLE_GCS_CODE_URL,
  args: EXAMPLE_BUILD_ARGS,
};
const EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
  cacheFrom: EXAMPLE_CACHE_FROM,
};

describe("createConfig", () => {
  test("creates config", () => {
    const image = createImage(EXAMPLE_TAG);
    expect(createConfig(EXAMPLE_BUILD_REQUEST)).toEqual({
      steps: [
        createBuildStep(EXAMPLE_BUILD_REQUEST, [image]),
        createPushStep(image),
      ],
      images: [image],
      source: {
        storageSource: {
          bucket: EXAMPLE_BUCKET,
          object: EXAMPLE_OBJECT,
        },
      },
      tags: createBuildTags(EXAMPLE_TAGS),
    });
  });
});

describe("createBuildStep", () => {
  const image = createImage(EXAMPLE_TAG);
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
          createTagParameter(image),
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
          createTagParameter(image),
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
    expect(createBuildStep(request, [image])).toEqual(expected);
  });
});

describe("createBuildArgParameter", () => {
  test("creates build arg parameter", () => {
    expect(
      createBuildArgParameter(EXAMPLE_BUILD_ARG_NAME, EXAMPLE_BUILD_ARG_VALUE)
    ).toBe(`--build-arg=${EXAMPLE_BUILD_ARG_NAME}=${EXAMPLE_BUILD_ARG_VALUE}`);
  });
});
