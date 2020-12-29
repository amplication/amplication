import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BuildRequest } from "../types";
import { parseGCSObjectURL } from "./gcs.util";

export const GCR_HOST = "gcr.io";
export const CLOUD_BUILDERS_DOCKER_IMAGE = "gcr.io/cloud-builders/docker";
export const DEFAULT_TAGS = ["container-builder"];

export function createConfig(
  request: BuildRequest
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSObjectURL(request.url);
  const images = request.tags.map(createImage);
  return {
    steps: [createBuildStep(request, images), ...images.map(createPushStep)],
    images,
    source: {
      storageSource: {
        bucket,
        object,
      },
    },
    tags: createBuildTags(request.tags),
  };
}

export function createImage(tag: string): string {
  return `${GCR_HOST}/${tag}`;
}

export function createBuildStep(
  request: BuildRequest,
  images: string[]
): google.devtools.cloudbuild.v1.IBuildStep {
  const tagParameters = images.map(createTagParameter);
  const buildArgParameters = Object.entries(request.args).map(([name, value]) =>
    createBuildArgParameter(name, value)
  );
  return {
    name: CLOUD_BUILDERS_DOCKER_IMAGE,
    args: [
      "build",
      ...tagParameters,
      ...buildArgParameters,
      request.cacheFrom && createCacheFromParameter(request.cacheFrom),
      ".",
    ].filter((arg): arg is string => typeof arg === "string"),
  };
}

export function createPushStep(
  tag: string
): google.devtools.cloudbuild.v1.IBuildStep {
  return {
    name: CLOUD_BUILDERS_DOCKER_IMAGE,
    args: ["push", tag],
  };
}

export function createTagParameter(tag: string): string {
  return `--tag=${tag}`;
}

export function createBuildArgParameter(name: string, value: string): string {
  return `--build-arg=${name}=${value}`;
}

export function createCacheFromParameter(image: string): string {
  return `--cache-from=${image}`;
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
