import { REACT_APP_FEATURE_FLAGS } from "../env";
import { InvalidFeatureFlagsEnvironmentVariableError } from "./InvalidFeatureFlagsEnvironmentVariableError";

export type FeatureFlags = Record<string, any>;

const EMPTY_FEATURE_FLAGS = {};

export function getFeatureFlags(): FeatureFlags {
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
