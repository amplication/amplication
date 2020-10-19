import { google } from "@google-cloud/cloudbuild/build/protos/protos";
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
  repository: string,
  tag: string,
  url: string,
  buildArgs: Record<string, string>
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSObjectURL(url);
  return {
    steps: [
      createBuildStep(
        Object.entries(buildArgs).map(([name, value]) =>
          createBuildArgParameter(name, value)
        )
      ),
      DOCKER_PUSH_STEP,
    ],
    images: IMAGES,
    tags: [tag], //the tag is holding amplication buildId and it is used to find the build after creation in Cloud Build
    source: {
      storageSource: {
        bucket,
        object,
      },
    },
    substitutions: {
      /** @todo use a nicer repository name */
      [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: repository,
      [IMAGE_TAG_SUBSTITUTION_KEY]: tag,
    },
  };
}
