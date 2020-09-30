import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import baseConfig from "./base-config.json";
import { parseGCSAuthenticatedURL } from "./gcs.util";

export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = "_IMAGE_REPOSITORY";
export const IMAGE_TAG_SUBSTITUTION_KEY = "_BUILD_ID";

export function createConfig(
  repository: string,
  tag: string,
  url: string
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSAuthenticatedURL(url);
  return {
    ...baseConfig,
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
