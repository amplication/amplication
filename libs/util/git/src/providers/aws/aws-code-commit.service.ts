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
import {
  CodeCommitClient,
  GetRepositoryCommand,
} from "@aws-sdk/client-codecommit";
import { NotImplementedError } from "../../utils/custom-error";

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

  private isRequiredValid<T>(
    value: T | null | undefined
  ): value is Required<T> {
    if (value === null || value === undefined) {
      return false;
    }

    const props = Object.getOwnPropertyNames(value);

    if (props.length > 0) {
      return props.every((prop) => {
        const propValue = value[prop];
        return propValue !== null && propValue !== undefined;
      });
    }
    return false;
  }

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
    const command = new GetRepositoryCommand({
      repositoryName: getRepositoryArgs.repositoryName,
    });
    const { repositoryMetadata } = await this.awsClient.send(command);

    if (this.isRequiredValid(repositoryMetadata)) {
      return {
        admin: false,
        defaultBranch: repositoryMetadata.defaultBranch,
        fullName: repositoryMetadata.repositoryName,
        name: repositoryMetadata.repositoryName,
        private: true,
        url: repositoryMetadata.cloneUrlHttp,
        groupName: null,
      };
    } else {
      throw new Error(
        `Repository ${getRepositoryArgs.repositoryName} not found`
      );
    }
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
