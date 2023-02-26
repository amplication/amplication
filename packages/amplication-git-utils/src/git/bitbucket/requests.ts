import fetch from "node-fetch";

enum GrantType {
  RefreshToken = "refresh_token",
  AuthorizationCode = "authorization_code",
}

interface RequestPayload {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

const AUTHORIZE_URL = "https://bitbucket.org/site/oauth2/authorize";
const ACCESS_TOKEN_URL = "https://bitbucket.org/site/oauth2/access_token";
const CURRENT_USER_URL = "https://api.bitbucket.org/2.0/user";

const getAuthHeaders = (clientId: string, clientSecret: string) => ({
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`,
});

const getRequestHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/json",
});

const requestWrapper = async (url: string, payload: RequestPayload) => {
  try {
    return fetch(url, payload);
  } catch (error) {
    throw new Error(error);
  }
};

export const authorizeRequest = async (
  clientId: string,
  amplicationWorkspaceId: string
) => {
  const callbackUrl = `${AUTHORIZE_URL}?client_id=${clientId}&response_type=code&state={state}}`;
  return callbackUrl.replace("{state}", amplicationWorkspaceId);
};

export const refreshTokenRequest = (
  clientId: string,
  clientSecret: string,
  refreshToken: string
) => {
  return requestWrapper(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.RefreshToken}&refresh_token=${refreshToken}`,
  });
};

export const authDataRequest = async (
  clientId: string,
  clientSecret: string,
  code: string
) => {
  return requestWrapper(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.AuthorizationCode}&code=${code}`,
  });
};

export const currentUserRequest = async (accessToken: string) => {
  return requestWrapper(CURRENT_USER_URL, {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
};
