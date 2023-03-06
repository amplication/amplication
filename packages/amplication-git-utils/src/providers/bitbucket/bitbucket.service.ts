import { GitProvider } from "../../git-provider.interface";
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
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  OAuth2FlowResponse,
  CloneUrlArgs,
  Commit,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  EnumGitProvider,
  GetBranchArgs,
  PullRequest,
} from "../../types";
import { NotImplementedError } from "../../utils/custom-error";
import {
  authDataRequest,
  authorizeRequest,
  currentUserRequest,
} from "./requests";
import { ILogger } from "@amplication/util/logging";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  public readonly name = EnumGitProvider.Bitbucket;
  public readonly domain = "bitbucket.com";

  constructor(private readonly logger: ILogger) {
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
    this.logger.info("BitBucketService init");
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

    this.logger.info("BitBucketService getAccessToken");
    const authData = await response.json();

    return {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      scopes: authData.scopes.split(" "),
      tokenType: authData.token_type,
      expiresIn: authData.expires_in,
    };
  }

  private async getCurrentUser(
    accessToken: string,
    refreshToken
  ): Promise<CurrentUser> {
    const currentUser = await currentUserRequest(
      accessToken,
      this.clientId,
      this.clientSecret,
      refreshToken,
      this.logger
    );

    const { links, created_on, display_name, username, uuid } = currentUser;
    this.logger.info("BitBucketService getCurrentUser");
    return {
      links,
      createdOn: created_on,
      displayName: display_name,
      name: username,
      uuid,
    };
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
    } = await this.getCurrentUser(accessToken, refreshToken);

    this.logger.info("BitBucketService completeOAuth2Flow");
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
  ): Promise<PullRequest> {
    throw NotImplementedError;
  }
  getBranch(args: GetBranchArgs): Promise<Branch | null> {
    throw NotImplementedError;
  }
  createBranch(args: CreateBranchArgs): Promise<Branch> {
    throw NotImplementedError;
  }
  getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit> {
    throw NotImplementedError;
  }
  getCurrentUserCommitList(args: GetBranchArgs): Promise<Commit[]> {
    throw NotImplementedError;
  }
  getCloneUrl(args: CloneUrlArgs): string {
    throw NotImplementedError;
  }
  commentOnPullRequest(args: CreatePullRequestCommentArgs): Promise<void> {
    throw NotImplementedError;
  }
  getToken(): Promise<string> {
    throw NotImplementedError;
  }
}
