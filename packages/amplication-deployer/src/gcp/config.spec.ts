import {
  createBackendConfigParameter,
  createConfig,
  createInitStep,
  APPLY_STEP,
  OUTPUT_STEP,
  DEFAULT_TAGS,
} from "./config";

const EXAMPLE_BUCKET = "EXAMPLE_BUCKET";
const EXAMPLE_ARCHIVE_NAME = "EXAMPLE_ARCHIVE_NAME";
const EXAMPLE_KEY = "EXAMPLE_KEY";
const EXAMPLE_VALUE = "EXAMPLE_VALUE";
const EXAMPLE_BACKEND_CONFIGURATION = { [EXAMPLE_KEY]: EXAMPLE_VALUE };

describe("createConfig", () => {
  test("creates config", () => {
    expect(
      createConfig(
        EXAMPLE_BUCKET,
        EXAMPLE_ARCHIVE_NAME,
        EXAMPLE_BACKEND_CONFIGURATION
      )
    ).toEqual({
      steps: [
        createInitStep([
          createBackendConfigParameter(EXAMPLE_KEY, EXAMPLE_VALUE),
        ]),
        APPLY_STEP,
        OUTPUT_STEP,
      ],
      source: {
        storageSource: {
          bucket: EXAMPLE_BUCKET,
          object: EXAMPLE_ARCHIVE_NAME,
        },
      },
      tags: DEFAULT_TAGS,
    });
  });
});

describe("createBackendConfigParameter", () => {
  test("creates backend config parameter", () => {
    expect(createBackendConfigParameter(EXAMPLE_KEY, EXAMPLE_VALUE)).toBe(
      `-backend-config=${EXAMPLE_KEY}=${EXAMPLE_VALUE}`
    );
  });
});
