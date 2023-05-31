import { environment } from "./environments/environment";
/**
 * Environment variables can come from process.env or from window
 * This module abstracts the source of them.
 */

function get(name: string): string | undefined {
  // @ts-ignore
  return window[name] || environment[name] || process.env[name];
}

export const NODE_ENV = get("NODE_ENV");
export const REACT_APP_GITHUB_AUTH_ENABLED = get(
  "NX_REACT_APP_GITHUB_AUTH_ENABLED"
);
export const REACT_APP_PADDLE_VENDOR_ID = get("NX_REACT_APP_PADDLE_VENDOR_ID");
export const REACT_APP_AMPLITUDE_API_KEY = get(
  "NX_REACT_APP_AMPLITUDE_API_KEY"
);
export const REACT_APP_FEATURE_FLAGS = get("NX_REACT_APP_FEATURE_FLAGS");
export const REACT_APP_GITHUB_CONTROLLER_LOGIN_URL = get(
  "NX_REACT_APP_GITHUB_CONTROLLER_LOGIN_URL"
);
export const REACT_APP_STORAGE_GATEWAY_URL = get(
  "NX_REACT_APP_STORAGE_GATEWAY_URL"
);
export const REACT_APP_DATA_SOURCE = get("NX_REACT_APP_DATA_SOURCE");
export const REACT_APP_PLUGIN_API_DATA_SOURCE = get(
  "NX_REACT_APP_PLUGIN_API_DATA_SOURCE"
);
export const REACT_APP_BILLING_ENABLED = get("NX_REACT_APP_BILLING_ENABLED");
export const REACT_APP_BILLING_API_KEY = get("NX_REACT_APP_BILLING_API_KEY");
