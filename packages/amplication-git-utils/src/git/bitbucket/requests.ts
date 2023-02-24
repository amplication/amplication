import fetch from "node-fetch";
import { AuthData } from "../../types";

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

const validateToken = (responseStatus: number, authData: AuthData) => {
  // TODO: scopes changed?
  const { expiresIn, refreshToken, clientId, clientSecret } = authData;
  return (
    responseStatus === 401 ||
    (expiresIn <= 60 &&
      refreshTokenRequest(clientId, clientSecret, refreshToken))
  );
};

const requestWrapper = async (
  url: string,
  payload: RequestPayload,
  authData: AuthData
) => {
  const request = await fetch(url, payload);
  const response = await request.json();
  const { status } = response;
  validateToken(status, authData);
  return request;
};

export const authorizeRequest = async (clientId: string) => {
  return `${AUTHORIZE_URL}?client_id=${clientId}&response_type=code`;
};

export const refreshTokenRequest = (
  clientId: string,
  clientSecret: string,
  refreshToken: string
) => {
  return fetch(ACCESS_TOKEN_URL, {
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
  return fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.AuthorizationCode}&code=${code}`,
  });
};

export const currentUserRequest = async (authData: AuthData) => {
  return requestWrapper(
    CURRENT_USER_URL,
    {
      method: "GET",
      headers: getRequestHeaders(authData.accessToken),
    },
    authData
  );
};
