import fetch from "node-fetch";
import { CustomError } from "../../utils/custom-error";
import {
  Account,
  OAuth2,
  PaginatedRepositories,
  TreeEntry,
  PaginatedTreeEntry,
  PaginatedWorkspaceMembership,
  Repository,
  Commit,
  Branch,
  PullRequestComment,
  PaginatedCommits,
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

const BITBUCKET_API_VERSION = "2.0";
const BITBUCKET_API_URL = `https://api.bitbucket.org/${BITBUCKET_API_VERSION}`;
const BITBUCKET_SITE_URL = "https://bitbucket.org/site";

const AUTHORIZE_URL = `${BITBUCKET_SITE_URL}/oauth2/authorize`;
const ACCESS_TOKEN_URL = `${BITBUCKET_SITE_URL}/oauth2/access_token`;

const CURRENT_USER_URL = `${BITBUCKET_API_URL}/user`;
const CURRENT_USER_WORKSPACES_URL = `${BITBUCKET_API_URL}/user/permissions/workspaces`;

const REPOSITORIES_IN_WORKSPACE_URL = (workspaceSlug: string) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}`;

const REPOSITORY_URL = (workspaceSlug: string, repositorySlug: string) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}`;

const REPOSITORY_CREATE_URL = (workspaceSlug: string, repositorySlug: string) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}`;

const GET_FILE_URL = (
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  pathToFile: string
) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}/src/${branchName}/${pathToFile}`;

const CREATE_COMMIT_URL = (workspaceSlug: string, repositorySlug: string) =>
  `${BITBUCKET_API_URL}/2.0/repositories//${workspaceSlug}/${repositorySlug}/src`;

const GET_BRANCH_COMMITS_URL = (
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string
) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}/commits/${branchName}`;

const GET_BRANCH_URL = (
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string
) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}/refs/branches/${branchName}`;

const CREATE_BRANCH_URL = (workspaceSlug: string, repositorySlug: string) =>
  `${BITBUCKET_API_URL}/repositories/${workspaceSlug}/${repositorySlug}/refs/branches`;

const CREATE_COMMENT_ON_PULL_REQUEST_URL = (
  workspaceSlug: string,
  repositorySlug: string,
  pullRequestId: number
) =>
  `${BITBUCKET_API_URL}/2.0/repositories/${workspaceSlug}/${repositorySlug}/pullrequests/${pullRequestId}/comments`;

const GET_COMMIT_LIST_URL = (workspaceSlug: string, repositorySlug: string) =>
  `${BITBUCKET_API_URL}/2.0/repositories/${workspaceSlug}/${repositorySlug}/commits/`;

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

async function requestWrapper(url: string, payload: RequestPayload) {
  try {
    const response = await fetch(url, payload);
    return response.json();
  } catch (error) {
    const errorBody = await error.response.text();
    throw new CustomError(errorBody);
  }
}

export async function authorizeRequest(
  clientId: string,
  amplicationWorkspaceId: string
): Promise<string> {
  const callbackUrl = `${AUTHORIZE_URL}?client_id=${clientId}&response_type=code&state={state}`;
  return callbackUrl.replace("{state}", amplicationWorkspaceId);
}

export async function refreshTokenRequest(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<OAuth2> {
  return requestWrapper(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.RefreshToken}&refresh_token=${refreshToken}`,
  });
}

export async function authDataRequest(
  clientId: string,
  clientSecret: string,
  code: string
): Promise<OAuth2> {
  return requestWrapper(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: getAuthHeaders(clientId, clientSecret),
    body: `grant_type=${GrantType.AuthorizationCode}&code=${code}`,
  });
}

export async function currentUserRequest(
  accessToken: string
): Promise<Account> {
  return requestWrapper(CURRENT_USER_URL, {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
}

export async function currentUserWorkspacesRequest(
  accessToken: string
): Promise<PaginatedWorkspaceMembership> {
  return requestWrapper(CURRENT_USER_WORKSPACES_URL, {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
}

export async function repositoriesInWorkspaceRequest(
  workspaceSlug: string,
  accessToken: string
): Promise<PaginatedRepositories> {
  return requestWrapper(REPOSITORIES_IN_WORKSPACE_URL(workspaceSlug), {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
}

export async function repositoryRequest(
  workspaceSlug: string,
  repositorySlug: string,
  accessToken: string
): Promise<Repository> {
  return requestWrapper(REPOSITORY_URL(workspaceSlug, repositorySlug), {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
}

export async function repositoryCreateRequest(
  workspaceSlug: string,
  repositorySlug: string,
  repositoryCreateData: Partial<Repository>,
  accessToken: string
): Promise<Repository> {
  return requestWrapper(REPOSITORY_CREATE_URL(workspaceSlug, repositorySlug), {
    method: "POST",
    headers: {
      ...getRequestHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repositoryCreateData),
  });
}

export async function getFileMetaRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  pathToFile: string,
  accessToken: string
): Promise<TreeEntry | PaginatedTreeEntry> {
  return requestWrapper(
    `${GET_FILE_URL(
      workspaceSlug,
      repositorySlug,
      branchName,
      pathToFile
    )}?format=meta`,
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    }
  );
}

export async function getFileRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  pathToFile: string,
  accessToken: string
): Promise<Buffer> {
  const response = await fetch(
    GET_FILE_URL(workspaceSlug, repositorySlug, branchName, pathToFile),
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    }
  );
  return response.buffer();
}

export function createCommitRequest(
  workspaceSlug: string,
  repositorySlug: string,
  commitData: any,
  accessToken: string
) {
  return requestWrapper(CREATE_COMMIT_URL(workspaceSlug, repositorySlug), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(commitData),
  });
}

export async function getLastCommitRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  accessToken: string
): Promise<Commit> {
  const [branchCommits] = await requestWrapper(
    GET_BRANCH_COMMITS_URL(workspaceSlug, repositorySlug, branchName),
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    }
  );
  return branchCommits.values;
}

export async function getFirstCommitRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  accessToken: string
): Promise<Commit> {
  const branchCommits = await requestWrapper(
    GET_BRANCH_COMMITS_URL(workspaceSlug, repositorySlug, branchName),
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    }
  );
  return branchCommits.values.pop();
}

export async function getBranchRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  accessToken: string
): Promise<Branch> {
  return requestWrapper(
    GET_BRANCH_URL(workspaceSlug, repositorySlug, branchName),
    {
      method: "GET",
      headers: getRequestHeaders(accessToken),
    }
  );
}

export async function createBranchRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchData: { name: string; target: { hash: string } },
  accessToken: string
): Promise<Branch> {
  return requestWrapper(CREATE_BRANCH_URL(workspaceSlug, repositorySlug), {
    method: "POST",
    headers: getRequestHeaders(accessToken),
    body: JSON.stringify(branchData),
  });
}

export async function createCommentOnPrRequest(
  workspaceSlug: string,
  repositorySlug: string,
  pullRequestId: number,
  comment: string,
  accessToken: string
): Promise<PullRequestComment> {
  return requestWrapper(
    CREATE_COMMENT_ON_PULL_REQUEST_URL(
      workspaceSlug,
      repositorySlug,
      pullRequestId
    ),
    {
      method: "POST",
      headers: getRequestHeaders(accessToken),
      body: JSON.stringify({ content: { raw: comment } }),
    }
  );
}

export function getUserCommitListRequest(
  workspaceSlug: string,
  repositorySlug: string,
  branchName: string,
  branchToExclude: string | undefined,
  author: string,
  accessToken: string
): Promise<PaginatedCommits> {
  const reqUrl = branchToExclude
    ? `${GET_COMMIT_LIST_URL(
        workspaceSlug,
        repositorySlug
      )}/?include=${branchName}&exclude=${branchToExclude}`
    : `${GET_COMMIT_LIST_URL(
        workspaceSlug,
        repositorySlug
      )}/?include=${branchName}`;

  return requestWrapper(reqUrl, {
    method: "GET",
    headers: getRequestHeaders(accessToken),
  });
}
