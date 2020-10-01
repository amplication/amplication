import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { parseGCSObjectURL } from "./gcs.util";

export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = "_IMAGE_REPOSITORY";
export const IMAGE_TAG_SUBSTITUTION_KEY = "_BUILD_ID";
export const DOCKER_PULL_STEP = {
  id: "docker-pull",
  name: "gcr.io/cloud-builders/docker",
  entrypoint: "bash",
  args: [
    "-c",
    "docker pull gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:latest || exit 0",
  ],
};
export const DOCKER_BUILD_STEP = {
  id: "docker-build",
  name: "gcr.io/cloud-builders/docker",
  args: [
    "build",
    "-t=gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID",
    "-t=gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:latest",
    ".",
    "--cache-from=gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:latest",
  ],
  waitFor: ["-"],
};
export const DOCKER_PUSH_STEP = {
  id: "docker-push",
  name: "gcr.io/cloud-builders/docker",
  args: ["push", "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID"],
  waitFor: ["docker-build"],
};
export const DOCKER_PUSH_LATEST_STEP = {
  id: "docker-push-latest",
  name: "gcr.io/cloud-builders/docker",
  args: ["push", "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:latest"],
  waitFor: ["docker-build"],
};
export const IMAGES = [
  "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:$_BUILD_ID",
  "gcr.io/$PROJECT_ID/$_IMAGE_REPOSITORY:latest",
];

export function createBuildArgParameter(name: string, value: string): string {
  return `--build-arg=${name}="${value}"`;
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
      DOCKER_PULL_STEP,
      {
        ...DOCKER_BUILD_STEP,
        args: [
          ...DOCKER_BUILD_STEP.args,
          ...Object.entries(buildArgs).map(([name, value]) =>
            createBuildArgParameter(name, value)
          ),
        ],
      },
      DOCKER_PUSH_STEP,
      DOCKER_PUSH_LATEST_STEP,
    ],
    images: IMAGES,
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
