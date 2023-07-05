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
  AwsCodeCommitProviderOrganizationProperties,
} from "../../types";
import { CodeCommitClient } from "@aws-sdk/client-codecommit";

export class AwsCodeCommitService implements GitProvider {
  public readonly name = EnumGitProvider.AwsCodeCommit;
  public readonly domain = "aws.amazon.com";
  private readonly gitCrentials: {
    username: string;
    password: string;
  };
  private readonly awsClient: CodeCommitClient;

  constructor(
    readonly providerOrganizationProperties: AwsCodeCommitProviderOrganizationProperties,
    private readonly logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: AwsCodeCommitService.name,
      },
    });

    const { gitCredentials, sdkCredentials } = providerOrganizationProperties;
    this.gitCrentials = gitCredentials;

    this.awsClient = new CodeCommitClient({
      credentials: {
        accessKeyId: sdkCredentials.accessKeyId,
        secretAccessKey: sdkCredentials.accessKeySecret,
      },
      region: sdkCredentials.region || "us-east-1",
      logger: this.logger,
    });
  }

  async init(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    throw new Error("Method not implemented.");
  }
  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    throw new Error("Method not implemented.");
  }
  async refreshAccessToken(): Promise<OAuthTokens> {
    throw new Error("Method not implemented.");
  }
  async getGitGroups(): Promise<PaginatedGitGroup> {
    throw new Error("Method not implemented.");
  }
  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw new Error("Method not implemented.");
  }
  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    throw new Error("Method not implemented.");
  }
  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    throw new Error("Method not implemented.");
  }
  async deleteGitOrganization(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async getOrganization(): Promise<RemoteGitOrganization> {
    throw new Error("Method not implemented.");
  }
  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    throw new Error("Method not implemented.");
  }
  async createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<PullRequest | null> {
    throw new Error("Method not implemented.");
  }
  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest> {
    throw new Error("Method not implemented.");
  }
  async getBranch(args: GetBranchArgs): Promise<Branch | null> {
    throw new Error("Method not implemented.");
  }
  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    throw new Error("Method not implemented.");
  }
  async getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit | null> {
    throw new Error("Method not implemented.");
  }
  async getCloneUrl(args: CloneUrlArgs): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getAmplicationBotIdentity(): Promise<Bot | null> {
    throw new Error("Method not implemented.");
  }
}
