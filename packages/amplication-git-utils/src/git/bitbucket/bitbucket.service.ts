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
  refreshTokenRequest,
} from "./requests";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string;
  private refreshToken: string;

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

  async refreshAccessToken(): Promise<OAuthData> {
    const response = await refreshTokenRequest(
      this.clientId,
      this.clientSecret,
      this.refreshToken
    );
    const authData = await response.json();
    return authData;
  }

  // TODO: rename to getAccessToken and code to authorizationCode
  async getAccessToken(authorizationCode: string): Promise<OAuth2FlowResponse> {
    try {
      const response = await authDataRequest(
        this.clientId,
        this.clientSecret,
        authorizationCode
      );

      const authData = await response.json();
      const { access_token, refresh_token, scopes, token_type, expires_in } =
        authData;
      const scopesArr = scopes.split(" ");
      this.accessToken = access_token;
      this.refreshToken = refresh_token;
      const {
        name: username,
        uuid,
        links,
        displayName,
        createdOn,
      } = await this.getCurrentUser();
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        scopes: scopesArr,
        tokenType: token_type,
        expiresIn: expires_in,
        userData: {
          name: username,
          uuid,
          links,
          displayName,
          createdOn,
        },
      };
    } catch (error) {
      // TODO: figure out how the error is look like
      const { message, code, status, cause } = error;
      throw new CustomError(message, { code, status, cause });
    }
  }

  private async getCurrentUser(): Promise<CurrentUser> {
    try {
      const response = await currentUserRequest(this.accessToken);
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

  async getOrganization(): Promise<RemoteGitOrganization> {
    const gitOrganization = await this.getCurrentUser();
    return {
      name: gitOrganization.name,
      type: EnumGitOrganizationType.User,
    };
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
