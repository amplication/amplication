import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import { parseGCSObjectURL } from "./gcs.util";

export const GCR_HOST = "gcr.io";
export const CLOUD_BUILDERS_DOCKER_IMAGE =
  "gcr.io/kaniko-project/executor:latest";
export const DEFAULT_TAGS = ["container-builder"];
export const DESTINATION_ARG = "destination";

export function createConfig(
  request: BuildRequest,
  projectId: string
): google.devtools.cloudbuild.v1.IBuild {
  const { cacheFrom = [] } = request;
  const { bucket, object } = parseGCSObjectURL(request.url);
  const images = request.tags.map((tag) => createImageId(tag, projectId));
  return {
    steps: [createBuildStep(request, images)],
    source: {
      storageSource: {
        bucket,
        object,
      },
    },
    tags: createBuildTags(request.tags),
    options: {
      machineType: "N1_HIGHCPU_8",
    },
  };
}

export function createImageId(tag: string, projectId: string): string {
  return `${GCR_HOST}/${projectId}/${tag}`;
}

export function createBuildStep(
  request: BuildRequest,
  images: string[]
): google.devtools.cloudbuild.v1.IBuildStep {
  const destinationParameters = images.map(createDestinationParameter);
  return {
    name: CLOUD_BUILDERS_DOCKER_IMAGE,
    args: [...destinationParameters, "--cache=true", "--cache-ttl=12h"],
  };
}

export function createDestinationParameter(image: string): string {
  return `--${DESTINATION_ARG}=${image}`;
}

export function createBuildTags(tags: string[]): string[] {
  // Tags format: ^[\w][\w.-]{0,127}$
  return [
    ...DEFAULT_TAGS,
    // Replace any forbidden character with a dash
    // Limit the tag length to 128 characters
    ...tags.map((tag) => `tag-${tag.replace(/[^\w.-]/, "-")}`.slice(128)),
  ];
}
