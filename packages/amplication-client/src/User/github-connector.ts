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
