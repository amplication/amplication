import { ILogger } from "@amplication/util/logging";
import { GitProvider } from "../../git-provider.interface";
import {
  EnumGitProvider,
  CurrentUser,
  OAuthTokens,
  PaginatedGitGroup,
  GetRepositoryArgs,
  RemoteGitRepository,
  GetRepositoriesArgs,
  RemoteGitRepos,
  CreateRepositoryArgs,
  RemoteGitOrganization,
  GetFileArgs,
  GitFile,
  CreatePullRequestFromFilesArgs,
  GitProviderGetPullRequestArgs,
  PullRequest,
  GitProviderCreatePullRequestArgs,
  GetBranchArgs,
  Branch,
  CreateBranchArgs,
  Commit,
  CloneUrlArgs,
  CreatePullRequestCommentArgs,
  Bot,
  OAuthProviderOrganizationProperties,
} from "../../types";
import { NotImplementedError } from "../../utils/custom-error";

export class GitLabService implements GitProvider {
  public readonly name = EnumGitProvider.GitLab;
  private readonly gitCrentials: {
    username: string;
    password: string;
  };
  private readonly client;

  constructor(
    readonly providerOrganizationProperties: OAuthProviderOrganizationProperties,
    private readonly logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: GitLabService.name,
      },
    });
  }
  domain: string;

  async init(): Promise<void> {
    throw NotImplementedError;
  }
  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    throw NotImplementedError;
  }
  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    throw NotImplementedError;
  }
  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    throw NotImplementedError;
  }
  async refreshAccessToken(): Promise<OAuthTokens> {
    throw NotImplementedError;
  }
  async getGitGroups(): Promise<PaginatedGitGroup> {
    throw NotImplementedError;
  }
  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw NotImplementedError;
  }
  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    throw NotImplementedError;
  }
  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    throw NotImplementedError;
  }
  async deleteGitOrganization(): Promise<boolean> {
    throw NotImplementedError;
  }
  async getOrganization(): Promise<RemoteGitOrganization> {
    throw NotImplementedError;
  }
  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    throw NotImplementedError;
  }
  async createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    throw NotImplementedError;
  }
  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<PullRequest | null> {
    throw NotImplementedError;
  }
  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest> {
    throw NotImplementedError;
  }
  async getBranch(args: GetBranchArgs): Promise<Branch | null> {
    throw NotImplementedError;
  }
  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    throw NotImplementedError;
  }
  async getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit | null> {
    throw NotImplementedError;
  }
  async getCloneUrl(args: CloneUrlArgs): Promise<string> {
    throw NotImplementedError;
  }
  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    throw NotImplementedError;
  }
  async getAmplicationBotIdentity(): Promise<Bot | null> {
    throw NotImplementedError;
  }
}
