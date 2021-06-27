/**
 * Environment variables can come from process.env or from window
 * This module abstracts the source of them.
 */

function get(name: string): string | undefined {
  // @ts-ignore
  return window[name] || process.env[name];
}

export const NODE_ENV = get("NODE_ENV");
export const REACT_APP_GITHUB_CLIENT_ID = get("REACT_APP_GITHUB_CLIENT_ID");
export const REACT_APP_AMPLITUDE_API_KEY = get("REACT_APP_AMPLITUDE_API_KEY");
export const REACT_APP_FEATURE_FLAGS = get("REACT_APP_FEATURE_FLAGS");
export const REACT_APP_GITHUB_CONTROLLER_LOGIN_URL = get(
  "REACT_APP_GITHUB_CONTROLLER_LOGIN_URL"
);
