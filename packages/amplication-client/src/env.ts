/**
 * Environment variables can come from process.env or from window
 * This module abstracts the source of them.
 */

export const { NODE_ENV } = process.env;

export const REACT_APP_GITHUB_CLIENT_ID =
  // @ts-ignore
  process.env.REACT_APP_GITHUB_CLIENT_ID || window.REACT_APP_GITHUB_CLIENT_ID;

export const REACT_APP_AMPLITUDE_API_KEY =
  // @ts-ignore
  process.env.REACT_APP_AMPLITUDE_API_KEY || window.REACT_APP_AMPLITUDE_API_KEY;
