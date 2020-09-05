const {
  REACT_APP_GITHUB_CLIENT_ID,
  REACT_APP_GITHUB_SCOPE,
  REACT_APP_GITHUB_REDIRECT_URI,
} = process.env;

type Config = {
  clientID: string;
  scope: string;
  redirectURI: string;
};

const STATE_STORAGE_KEY = "GITHUB_LOGIN_STATE";
const ACCESS_TOKEN_STORAGE_KEY = "GITHUB_ACCESS_TOKEN";

const JSON_MIME = "application/json";
const ACCESS_TOKEN_ENDPOINT = "/github/login/oauth/access_token";

/**
 * @see https://docs.github.com/en/developers/apps/authorizing-oauth-apps#1-request-a-users-github-identity
 */
export function getAuthorizeURL(
  clientID: string,
  scope: string,
  redirectURI: string,
  state: string
): string {
  // @ts-ignore
  const params = new URLSearchParams({
    client_id: clientID,
    scope,
    redirect_uri: redirectURI,
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

/**
 * @see https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
 */
export async function createAuthToken(
  clientID: string,
  code: string,
  redirectURI: string,
  state: string
) {
  // GitHub access_token endpoint requires client_secret which is not present
  // in the client code. To send it the code is sending a request to internal
  // server route that will send the request to GitHub with the secret.
  const res = await fetch(ACCESS_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: JSON_MIME,
    },
    body: new URLSearchParams({
      client_id: clientID,
      code: code,
      redirect_uri: redirectURI,
      state: state,
    }),
  });
  if (res.status !== 201) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return data.access_token;
}

export function hasConfig(): boolean {
  return Boolean(REACT_APP_GITHUB_CLIENT_ID);
}

export function getConfig(): Config {
  if (!REACT_APP_GITHUB_CLIENT_ID) {
    throw new Error("REACT_APP_GITHUB_CLIENT_ID must be defined");
  }
  if (!REACT_APP_GITHUB_SCOPE) {
    throw new Error("REACT_APP_GITHUB_SCOPE must be defined");
  }
  if (!REACT_APP_GITHUB_REDIRECT_URI) {
    throw new Error("REACT_APP_GITHUB_REDIRECT_URI must be defined");
  }
  return {
    clientID: REACT_APP_GITHUB_CLIENT_ID,
    scope: REACT_APP_GITHUB_SCOPE,
    redirectURI: REACT_APP_GITHUB_REDIRECT_URI,
  };
}

export const getCode = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

export const createState = (): string => {
  const state = JSON.stringify({ ds: Number(new Date()) });
  localStorage.setItem(STATE_STORAGE_KEY, state);
  return state;
};

export const getState = (): string | null => {
  return localStorage.getItem(STATE_STORAGE_KEY);
};

export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};
