import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import { parseGCSObjectURL } from "./gcs.util";

export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = "_IMAGE_REPOSITORY";
export const IMAGE_TAG_SUBSTITUTION_KEY = "_BUILD_ID";
export const DOCKER_PUSH_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  id: "docker-push",
  name: "gcr.io/cloud-builders/docker",
  args: ["push", "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID"],
};
export const IMAGES = ["gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID"];
export const DEFAULT_TAGS = ["container-builder"];
export const TAG_BUILD_ARG =
  "-t=gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID";

export function createBuildArgParameter(name: string, value: string): string {
  return `--build-arg=${name}=${value}`;
}

export function createCacheFromParameter(image: string): string {
  return `--cache-from=${image}`;
}

export function createBuildStep(
  request: BuildRequest
): google.devtools.cloudbuild.v1.IBuildStep {
  const buildArgParameters = Object.entries(request.args).map(([name, value]) =>
    createBuildArgParameter(name, value)
  );
  return {
    id: "docker-build",
    name: "gcr.io/cloud-builders/docker",
    args: [
      "build",
      TAG_BUILD_ARG,
      ...buildArgParameters,
      request.cacheFrom && createCacheFromParameter(request.cacheFrom),
      ".",
    ].filter((arg): arg is string => typeof arg === "string"),
  };
}

export function createConfig(
  request: BuildRequest
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSObjectURL(request.url);
  return {
    steps: [createBuildStep(request), DOCKER_PUSH_STEP],
    images: IMAGES,
    source: {
      storageSource: {
        bucket,
        object,
      },
    },
    substitutions: {
      [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: request.repository,
      [IMAGE_TAG_SUBSTITUTION_KEY]: request.tag,
    },
    tags: createTags(request.repository, request.tag),
  };
}

export function createTags(repository: string, tag: string): string[] {
  // Tags format: ^[\w][\w.-]{0,127}$
  return [...DEFAULT_TAGS, `repository-${repository}`, `tag-${tag}`];
}
