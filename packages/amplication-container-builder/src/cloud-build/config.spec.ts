import {
  createConfig,
  IMAGE_REPOSITORY_SUBSTITUTION_KEY,
  IMAGE_TAG_SUBSTITUTION_KEY,
} from "./config";
import baseConfig from "./base-config.json";
import { GCS_HOST } from "./gcs.util";

const EXAMPLE_REPOSITORY = "EXAMPLE_REPOSITORY";
const EXAMPLE_TAG = "EXAMPLE_TAG";
const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_OBJECT = "EXAMPLE_OBJECT";
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;

describe("createConfig", () => {
  test("creates config", () => {
    expect(
      createConfig(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_GCS_CODE_URL)
    ).toEqual({
      ...baseConfig,
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
    });
  });
});
