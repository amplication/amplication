import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types/BuildRequest";
import { parseGCSObjectURL } from "./gcs.util";

export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = "_IMAGE_REPOSITORY";
export const IMAGE_TAG_SUBSTITUTION_KEY = "_BUILD_ID";
export const DOCKER_PUSH_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  id: "docker-push",
  name: "gcr.io/cloud-builders/docker",
  args: ["push", "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID"],
};
export const IMAGES = ["gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID"];

export function createBuildArgParameter(name: string, value: string): string {
  return `--build-arg=${name}=${value}`;
}

export const DEFAULT_TAGS = ["container-builder"];

export function createBuildStep(
  parameters: string[]
): google.devtools.cloudbuild.v1.IBuildStep {
  return {
    id: "docker-build",
    name: "gcr.io/cloud-builders/docker",
    args: [
      "build",
      "-t=gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID",
      ...parameters,
      ".",
    ],
  };
}

export function createConfig(
  request: BuildRequest
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSObjectURL(request.url);
  return {
    steps: [
      createBuildStep(
        Object.entries(request.args).map(([name, value]) =>
          createBuildArgParameter(name, value)
        )
      ),
      DOCKER_PUSH_STEP,
    ],
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
