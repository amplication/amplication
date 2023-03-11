import fetch from "node-fetch";
import { ILogger } from "@amplication/util/logging";
import { CustomError } from "../../utils/custom-error";
import {
  Account,
  OAuth2,
  PaginatedRepositories,
  PaginatedWorkspaceMembership,
  Repository,
} from "./bitbucket.types";

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
const CURRENT_USER_WORKSPACES_URL =
  "https://api.bitbucket.org/2.0/user/permissions/workspaces";

const REPOSITORIES_IN_WORKSPACE_URL = (workspaceSlug: string) =>
  `https://api.bitbucket.org/2.0/repositories/${workspaceSlug}`;

const REPOSITORY_URL = (workspaceSlug: string, repositorySlug: string) =>
  `https://api.bitbucket.org/2.0/repositories/${workspaceSlug}/${repositorySlug}`;

const REPOSITORY_CREATE_URL = (workspaceSlug: string, repositorySlug: string) =>
  `https://api.bitbucket.org/2.0/repositories/${workspaceSlug}/${repositorySlug}`;

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
    let response = await fetch(url, payload);
    if (response.status === 401) {
      logger.error("Unauthorized request");
      const { access_token, refresh_token } = await refreshTokenRequest(
        clientId,
        clientSecret,
        refreshToken
      );
      refreshToken = refresh_token;
      const newPayload = {
        ...payload,
        headers: getRequestHeaders(access_token),
      };
      response = await fetch(url, newPayload);
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
): Promise<OAuth2> {
  const response = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.RefreshToken}&refresh_token=${refreshToken}`,
  });
  return response.json();
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
): Promise<Account> {
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

export async function currentUserWorkspacesRequest(
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
): Promise<PaginatedWorkspaceMembership> {
  return requestWrapper(
    CURRENT_USER_WORKSPACES_URL,
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

export async function repositoriesInWorkspaceRequest(
  workspaceSlug: string,
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
): Promise<PaginatedRepositories> {
  return requestWrapper(
    REPOSITORIES_IN_WORKSPACE_URL(workspaceSlug),
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

export async function repositoryRequest(
  workspaceSlug: string,
  repositorySlug: string,
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
): Promise<Repository> {
  return requestWrapper(
    REPOSITORY_URL(workspaceSlug, repositorySlug),
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

export async function repositoryCreateRequest(
  workspaceSlug: string,
  repositorySlug: string,
  repositoryCreateData: Partial<Repository>,
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  logger: ILogger
): Promise<Repository> {
  return requestWrapper(
    REPOSITORY_CREATE_URL(workspaceSlug, repositorySlug),
    {
      method: "POST",
      headers: {
        ...getRequestHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(repositoryCreateData),
    },
    clientId,
    clientSecret,
    refreshToken,
    logger
  );
}
