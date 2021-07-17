import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import {
  createConfig,
  createBuildStep,
  createBuildTags,
  CLOUD_BUILDERS_DOCKER_IMAGE,
  createImageId,
  createDestinationParameter,
} from "./config";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_TAG = "EXAMPLE_REPOSITORY:EXAMPLE_TAG";
const EXAMPLE_TAGS = [EXAMPLE_TAG];
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_BUILD_ARG_NAME = "EXAMPLE_BUILD_ARG_NAME";
const EXAMPLE_BUILD_ARG_VALUE = "EXAMPLE_BUILD_ARG_VALUE";
const EXAMPLE_CACHE_FROM_IMAGE = "EXAMPLE_CACHE_FROM_IMAGE";
const EXAMPLE_CACHE_FROM = [EXAMPLE_CACHE_FROM_IMAGE];
const EXAMPLE_BUILD_ARGS = {
  [EXAMPLE_BUILD_ARG_NAME]: EXAMPLE_BUILD_ARG_VALUE,
};
const EXAMPLE_BUILD_REQUEST: BuildRequest = {
  tags: EXAMPLE_TAGS,
  url: EXAMPLE_GCS_CODE_URL,
};
const EXAMPLE_BUILD_REQUEST_WITH_ARGS: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
  args: EXAMPLE_BUILD_ARGS,
};
const EXAMPLE_BUILD_REQUEST_WITH_CACHE_FROM: BuildRequest = {
  ...EXAMPLE_BUILD_REQUEST,
  cacheFrom: EXAMPLE_CACHE_FROM,
};

describe("createConfig", () => {
  test("creates config", () => {
    const image = createImageId(EXAMPLE_TAG, EXAMPLE_PROJECT_ID);
    expect(createConfig(EXAMPLE_BUILD_REQUEST, EXAMPLE_PROJECT_ID)).toEqual({
      steps: [createBuildStep(EXAMPLE_BUILD_REQUEST, [image])],
      source: {
        storageSource: {
          bucket: EXAMPLE_BUCKET,
          object: EXAMPLE_OBJECT,
        },
      },
      tags: createBuildTags(EXAMPLE_TAGS),
      options: {
        machineType: "N1_HIGHCPU_8",
      },
    });
  });
});

describe("createBuildStep", () => {
  const image = createImageId(EXAMPLE_TAG, EXAMPLE_PROJECT_ID);
  const cases: Array<[
    string,
    BuildRequest,
    google.devtools.cloudbuild.v1.IBuildStep
  ]> = [
    [
      "Basic request",
      EXAMPLE_BUILD_REQUEST,
      {
        name: CLOUD_BUILDERS_DOCKER_IMAGE,
        args: [
          createDestinationParameter(image),
          "--cache=true",
          "--cache-ttl=12h",
        ],
      },
    ],
  ];
  test.each(cases)("%s", (name, request, expected) => {
    expect(createBuildStep(request, [image])).toEqual(expected);
  });
});
