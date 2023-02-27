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
  EnumGitOrganizationType,
} from "../../types";
import { CustomError, NotImplementedError } from "../../utils/custom-error";
import {
  authDataRequest,
  authorizeRequest,
  currentUserRequest,
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
    try {
      const response = await authDataRequest(
        this.clientId,
        this.clientSecret,
        authorizationCode
      );

      const authData = await response.json();
      const { access_token, refresh_token, scopes, token_type, expires_in } =
        authData;

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        scopes: scopes.split(" "),
        tokenType: token_type,
        expiresIn: expires_in,
      };
    } catch (error) {
      // TODO: figure out how the error is look like
      const { message, code, status, cause } = error;
      throw new CustomError(message, { code, status, cause });
    }
  }

  private async getCurrentUser(accessToken: string): Promise<CurrentUser> {
    try {
      const response = await currentUserRequest(accessToken);
      const currentUser = await response.json();

      const { links, created_on, display_name, username, uuid } = currentUser;
      return {
        links,
        createdOn: created_on,
        displayName: display_name,
        name: username,
        uuid,
      };
    } catch (error) {
      throw new CustomError(error.message, error);
    }
  }

  async completeOAuth2Flow(
    authorizationCode: string
  ): Promise<OAuth2FlowResponse> {
    const { accessToken, refreshToken, expiresIn, tokenType, scopes } =
      await this.getAccessToken(authorizationCode);
    const {
      name: username,
      uuid,
      links,
      displayName,
      createdOn,
    } = await this.getCurrentUser(accessToken);

    return {
      accessToken,
      refreshToken,
      scopes,
      tokenType,
      expiresIn,
      userData: {
        name: username,
        uuid,
        links,
        displayName,
        createdOn,
      },
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
