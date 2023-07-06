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
  EnumGitOrganizationType,
} from "../../types";
import {
  CodeCommitClient,
  CreateRepositoryCommand,
  GetFileCommand,
  GetRepositoryCommand,
  ListRepositoriesCommand,
} from "@aws-sdk/client-codecommit";
import { NotImplementedError } from "../../utils/custom-error";
import { parse } from "node:path";

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
    const { repositoryName } = getRepositoryArgs;
    const command = new GetRepositoryCommand({
      repositoryName,
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
      throw new Error(`Repository ${repositoryName} not found`);
    }
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const { pagination } = getRepositoriesArgs;
    const command = new ListRepositoriesCommand({
      sortBy: "repositoryName",
      order: "ascending",
    });

    // TODO improve pagination
    const { repositories } = await this.awsClient.send(command);
    let paginatedRepositories: RemoteGitRepository[] = [];
    if (repositories && repositories.length > 0) {
      const skip = (pagination.page - 1) * pagination.perPage;
      const take = skip + pagination.perPage;
      paginatedRepositories = repositories
        .slice(skip, take)
        .map((repository) => {
          if (this.isRequiredValid(repository)) {
            return {
              admin: false,
              defaultBranch: "",
              fullName: repository.repositoryName,
              name: repository.repositoryName,
              private: true,
              url: "",
              groupName: null,
            };
          } else {
            throw new Error(
              `Repository ${repository.repositoryName} not found`
            );
          }
        });
    }
    return {
      pagination,
      repos: paginatedRepositories,
      total: repositories?.length || 0,
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    const { repositoryName } = createRepositoryArgs;
    const command = new CreateRepositoryCommand({
      repositoryName,
      repositoryDescription: "Created by Amplication",
      tags: { system: "Amplication" },
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
      throw new Error(`Repository ${repositoryName} not found`);
    }
  }

  async deleteGitOrganization(): Promise<boolean> {
    // There is nothing to uninstall/delete when an organisation is deleted in AWS CodeCommit.
    return true;
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    return {
      name: "AWS CodeCommit",
      type: EnumGitOrganizationType.User,
      useGroupingForRepositories: false,
    };
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    const command = new GetFileCommand({
      filePath: file.path,
      repositoryName: file.repositoryName,
      commitSpecifier: file.ref,
    });
    try {
      const { fileContent, filePath } = await this.awsClient.send(command);

      if (fileContent && filePath) {
        return {
          content: fileContent.toString(),
          path: filePath,
          name: parse(filePath).name,
        };
      }
    } catch {
      return null;
    }
    return null;
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
    const { repositoryName } = args;
    const command = new GetRepositoryCommand({
      repositoryName,
    });

    const { repositoryMetadata } = await this.awsClient.send(command);

    if (this.isRequiredValid(repositoryMetadata)) {
      const { cloneUrlHttp } = repositoryMetadata;
      const encodedUsername = encodeURIComponent(this.gitCrentials.username);
      const encodedPassword = encodeURIComponent(this.gitCrentials.password);

      if (!this.gitCrentials.username || !this.gitCrentials.password) {
        return cloneUrlHttp;
      }

      const authenticatedCloneUrlHttp = cloneUrlHttp.replace(
        "https://",
        `https://${encodedUsername}:${encodedPassword}@`
      );
      return authenticatedCloneUrlHttp;
    } else {
      throw new Error(`Repository ${repositoryName} not found`);
    }
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
