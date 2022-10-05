import { getFeatureFlags } from "./get-feature-flags";

const featureFlags = getFeatureFlags();

export const SHOW_UI_ELEMENTS = Boolean(featureFlags.SHOW_UI_ELEMENTS);
export const SHOW_DEPLOYER = Boolean(featureFlags.SHOW_DEPLOYER);
