import { ILogger } from "@amplication/util/logging";
import fetch from "node-fetch";
import { CustomError } from "../../utils/custom-error";

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

async function requestWrapper(
  url: string,
  payload: RequestPayload,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
) {
  try {
    const response = await fetch(url, payload);
    if (response.status === 401) {
      return refreshTokenRequest(clientId, clientSecret, refreshToken);
    }
    return (await response).json();
  } catch (error) {
    const errorBody = await error.response.text();
    logger.error(errorBody);
    throw new CustomError(errorBody);
  }
}

export async function authorizeRequest(
  clientId: string,
  amplicationWorkspaceId: string
) {
  const callbackUrl = `${AUTHORIZE_URL}?client_id=${clientId}&response_type=code&state={state}`;
  return callbackUrl.replace("{state}", amplicationWorkspaceId);
}

export async function refreshTokenRequest(
  clientId: string,
  clientSecret: string,
  refreshToken: string
) {
  return fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.RefreshToken}&refresh_token=${refreshToken}`,
  });
}

export async function authDataRequest(
  clientId: string,
  clientSecret: string,
  code: string
) {
  return fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.AuthorizationCode}&code=${code}`,
  });
}

export async function currentUserRequest(
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
) {
  return requestWrapper(
    CURRENT_USER_URL,
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    },
    clientId,
    clientSecret,
    refreshToken,
    logger
  );
}
