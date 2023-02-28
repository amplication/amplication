import {
  OAuthData,
  Branch,
  CreateBranchIfNotExistsArgs,
  CreateCommitArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  GetFileArgs,
  GetPullRequestForBranchArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  GitProvider,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  OAuth2FlowResponse,
  PaginatedWorkspaceMembership,
} from "../../types";
import { CustomError, NotImplementedError } from "../../utils/custom-error";
import {
  authDataRequest,
  authorizeRequest,
  currentUserRequest,
  currentUserWorkspacesRequest,
} from "./requests";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    // TODO: move env variables to the server config
    const { BITBUCKET_CLIENT_ID, BITBUCKET_CLIENT_SECRET, CALLBACK_URL } =
      process.env;

    if (!BITBUCKET_CLIENT_ID || !BITBUCKET_CLIENT_SECRET || !CALLBACK_URL) {
      throw new Error("Missing BitBucket env variables");
    }

    this.clientId = BITBUCKET_CLIENT_ID;
    this.clientSecret = BITBUCKET_CLIENT_SECRET;
  }

  async init(): Promise<void> {
    console.log("init");
    const { clientId, clientSecret } = this;
    console.log({ clientId, clientSecret });
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return authorizeRequest(this.clientId, amplicationWorkspaceId);
  }

  private async getAccessToken(authorizationCode: string): Promise<OAuthData> {
    const response = await authDataRequest(
      this.clientId,
      this.clientSecret,
      authorizationCode
    );

    const authData = await response.json();

    return {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      scopes: authData.scopes.split(" "),
      tokenType: authData.token_type,
      expiresIn: authData.expires_in,
    };
  }

  private async getCurrentUser(accessToken: string): Promise<CurrentUser> {
    const currentUser = await currentUserRequest(accessToken);

    const { links, created_on, display_name, username, uuid } = currentUser;
    return {
      links,
      createdOn: created_on,
      displayName: display_name,
      name: username,
      uuid,
    };
  }

  private async getWorkspacesOfCurrentUser(
    accessToken: string
  ): Promise<PaginatedWorkspaceMembership> {
    const currentUserWorkspaces = await currentUserWorkspacesRequest(
      accessToken
    );
    return currentUserWorkspaces;
  }

  async completeOAuth2Flow(
    authorizationCode: string
  ): Promise<OAuth2FlowResponse> {
    const { accessToken, refreshToken, expiresIn, tokenType, scopes } =
      await this.getAccessToken(authorizationCode);

    const {
      name: username,
      uuid: userUuid,
      links: userLinks,
      displayName,
      createdOn,
    } = await this.getCurrentUser(accessToken);

    const paginatedWorkspaceMembership = await this.getWorkspacesOfCurrentUser(
      accessToken
    );

    const { values } = paginatedWorkspaceMembership;
    const currentUserWorkspaces = values.map(
      ({
        workspace: {
          name: workspaceName,
          uuid: workspaceUuid,
          slug: workspaceSlug,
          type: workspaceType,
          links: workspaceLinks,
        },
      }) => ({
        name: workspaceName,
        uuid: workspaceUuid,
        slug: workspaceSlug,
        type: workspaceType,
        links: workspaceLinks,
      })
    );

    return {
      accessToken,
      refreshToken,
      scopes,
      tokenType,
      expiresIn,
      userData: {
        name: username,
        uuid: userUuid,
        links: userLinks,
        displayName,
        createdOn,
      },
      workspaces: currentUserWorkspaces,
    };
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    throw NotImplementedError;
  }

  getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw NotImplementedError;
  }

  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    throw NotImplementedError;
  }

  createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw NotImplementedError;
  }

  deleteGitOrganization(): Promise<boolean> {
    throw NotImplementedError;
  }

  getFile(file: GetFileArgs): Promise<GitFile> {
    throw NotImplementedError;
  }

  createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    throw NotImplementedError;
  }

  createBranchIfNotExists(
    createBranchIfNotExistsArgs: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    throw NotImplementedError;
  }

  createCommit(createCommitArgs: CreateCommitArgs): Promise<void> {
    throw NotImplementedError;
  }

  getPullRequestForBranch(
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ): Promise<{ url: string; number: number }> {
    throw NotImplementedError;
  }

  createPullRequestForBranch(
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ): Promise<string> {
    throw NotImplementedError;
  }
}
