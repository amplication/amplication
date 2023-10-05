/**
 * Environment variables can come from process.env or from window
 * This module abstracts the source of them.
 */

function get(name: string): string | undefined {
  // @ts-ignore
  return window[name] || process.env[name];
}

export const REACT_APP_SERVER_URL = get("REACT_APP_SERVER_URL");
