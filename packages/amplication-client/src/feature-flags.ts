import { REACT_APP_FEATURE_FLAGS } from "./env";

type FeatureFlags = Record<string, any>;

const featureFlags = getFeatureFlags();

export const SHOW_UI_ELEMENTS = Boolean(featureFlags.SHOW_UI_ELEMENTS);

// Parse

const EMPTY_FEATURE_FLAGS = {};

function getFeatureFlags(): FeatureFlags {
  if (!REACT_APP_FEATURE_FLAGS) {
    return EMPTY_FEATURE_FLAGS;
  }
  let featureFlags;
  try {
    featureFlags = JSON.parse(REACT_APP_FEATURE_FLAGS);
  } catch (error) {
    throw new InvalidFeatureFlagsEnvironmentVariableError(
      REACT_APP_FEATURE_FLAGS
    );
  }
  if (!REACT_APP_FEATURE_FLAGS) {
    return EMPTY_FEATURE_FLAGS;
  }
  if (typeof featureFlags !== "object") {
    throw new InvalidFeatureFlagsEnvironmentVariableError(
      REACT_APP_FEATURE_FLAGS
    );
  }
  return featureFlags;
}

class InvalidFeatureFlagsEnvironmentVariableError extends Error {
  constructor(value: string) {
    super(
      `Feature flags environment variable should contain a valid JSON object. Instead received: ${value}`
    );
  }
}
