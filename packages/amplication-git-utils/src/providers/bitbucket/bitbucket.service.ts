import { parse } from "path";
import { GitProvider } from "../../git-provider.interface";
import {
  OAuthData,
  Branch,
  GitProviderCreatePullRequestArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  GetFileArgs,
  GitProviderGetPullRequestArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  CloneUrlArgs,
  Commit,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  EnumGitProvider,
  GetBranchArgs,
  PullRequest,
  GitProviderArgs,
  PaginatedGitGroup,
  BitBucketConfiguration,
  Bot,
} from "../../types";
import { CustomError, NotImplementedError } from "../../utils/custom-error";
import {
  authDataRequest,
  authorizeRequest,
  createBranchRequest,
  createCommentOnPrRequest,
  currentUserRequest,
  currentUserWorkspacesRequest,
  getBranchRequest,
  getFileMetaRequest,
  getFileRequest,
  getFirstCommitRequest,
  refreshTokenRequest,
  repositoriesInWorkspaceRequest,
  repositoryCreateRequest,
  repositoryRequest,
  getPullRequestByBranchNameRequest,
  createPullRequestFromRequest,
} from "./requests";
import { ILogger } from "@amplication/util/logging";
import { PaginatedTreeEntry, TreeEntry } from "./bitbucket.types";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string;
  public readonly name = EnumGitProvider.Bitbucket;
  public readonly domain = "bitbucket.com";

  constructor(
    private readonly gitProviderArgs: GitProviderArgs,
    private readonly providerConfiguration: BitBucketConfiguration,
    private readonly logger: ILogger
  ) {}

  async init(): Promise<void> {
    this.logger.info("BitbucketService init");
    const { accessToken } = this.gitProviderArgs.providerOrganizationProperties;
    const { clientId, clientSecret } = this.providerConfiguration;

    if (!clientId || !clientSecret) {
      this.logger.error("Missing Bitbucket configuration");
      throw new Error("Missing Bitbucket configuration");
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accessToken;
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return authorizeRequest(this.clientId, amplicationWorkspaceId);
  }

  async getAccessToken(authorizationCode: string): Promise<OAuthData> {
    const authData = await authDataRequest(
      this.clientId,
      this.clientSecret,
      authorizationCode
    );

    this.logger.info("BitBucketService: getAccessToken");

    return {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      scopes: authData.scopes.split(" "),
      tokenType: authData.token_type,
      expiresAt: Date.now() + authData.expires_in * 1000, // 7200 seconds = 2 hours
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthData> {
    const newOAuthData = await refreshTokenRequest(
      this.clientId,
      this.clientSecret,
      refreshToken
    );

    this.logger.info("BitBucketService: refreshAccessToken");

    return {
      accessToken: newOAuthData.access_token,
      refreshToken: newOAuthData.refresh_token,
      scopes: newOAuthData.scopes.split(" "),
      tokenType: newOAuthData.token_type,
      expiresAt: Date.now() + newOAuthData.expires_in * 1000, // 7200 seconds = 2 hours
    };
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    const currentUser = await currentUserRequest(accessToken);

    const { links, display_name, username, uuid } = currentUser;
    this.logger.info("BitBucketService getCurrentUser");
    return {
      links,
      displayName: display_name,
      username,
      uuid,
      useGroupingForRepositories: true,
    };
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    const paginatedWorkspaceMembership = await currentUserWorkspacesRequest(
      this.accessToken
    );

    const {
      size: total,
      page,
      pagelen: pageSize,
      next,
      previous,
      values,
    } = paginatedWorkspaceMembership;
    const gitGroups = values.map(({ workspace }) => {
      const { uuid: workspaceUuid, name, slug } = workspace;
      return {
        id: workspaceUuid,
        name,
        slug,
      };
    });

    this.logger.info("BitBucketService getGitGroups");

    return {
      total,
      page,
      pageSize,
      next,
      previous,
      groups: gitGroups,
    };
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    throw NotImplementedError;
  }

  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { repositoryGroupName, repositoryName } = getRepositoryArgs;

    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const repository = await repositoryRequest(
      repositoryGroupName,
      repositoryName,
      this.accessToken
    );
    const { links, name, is_private, full_name, mainbranch, accessLevel } =
      repository;

    return {
      name,
      url: links.html.href,
      private: is_private,
      fullName: full_name,
      admin: !!(accessLevel === "admin"),
      defaultBranch: mainbranch.name,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const { repositoryGroupName } = getRepositoriesArgs;

    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const repositoriesInWorkspace = await repositoriesInWorkspaceRequest(
      repositoryGroupName,
      this.accessToken
    );

    const { size, page, pagelen, values } = repositoriesInWorkspace;
    const gitRepos = values.map(
      ({ name, is_private, links, full_name, mainbranch, accessLevel }) => {
        return {
          name,
          url: links.html.href,
          private: is_private,
          fullName: full_name,
          admin: !!(accessLevel === "admin"),
          defaultBranch: mainbranch.name,
        };
      }
    );

    return {
      repos: gitRepos,
      total: size,
      currentPage: page,
      pageSize: pagelen,
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const {
      repositoryGroupName,
      repositoryName,
      isPrivateRepository,
      gitOrganization,
    } = createRepositoryArgs;

    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const newRepository = await repositoryCreateRequest(
      repositoryGroupName,
      repositoryName,
      {
        is_private: isPrivateRepository,
        name: repositoryName,
        full_name: `${gitOrganization.name}/${repositoryName}`,
      },
      this.accessToken
    );

    return {
      name: newRepository.name,
      url: "https://bitbucket.org/" + newRepository.full_name,
      private: newRepository.is_private,
      fullName: newRepository.full_name,
      admin: !!(newRepository.accessLevel === "admin"),
      defaultBranch: newRepository.mainbranch.name,
    };
  }

  deleteGitOrganization(): Promise<boolean> {
    throw NotImplementedError;
  }

  // pull request flow

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    const { owner, repositoryName, baseBranchName, path } = file;

    if (!baseBranchName) {
      this.logger.error("Missing baseBranchName");
      throw new CustomError("Missing baseBranchName");
    }

    const fileResponse = await getFileMetaRequest(
      owner,
      repositoryName,
      baseBranchName,
      path,
      this.accessToken
    );

    const fileBufferResponse = await getFileRequest(
      owner,
      repositoryName,
      baseBranchName,
      path,
      this.accessToken
    );

    if ((fileResponse as PaginatedTreeEntry).values) {
      this.logger.error(
        "BitbucketService getFile: Path points to a directory, please provide a file path"
      );
      throw new CustomError(
        "Path points to a directory, please provide a file path"
      );
    }

    const gitFileResponse = fileResponse as TreeEntry;
    this.logger.info("BitBucketService getFile");

    return {
      content: fileBufferResponse.toString("utf-8"),
      htmlUrl: gitFileResponse.commit.links.html.href,
      name: parse(gitFileResponse.path).name,
      path: gitFileResponse.path,
    };
  }

  createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    throw NotImplementedError;
  }

  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<{ url: string; number: number }> {
    const { repositoryGroupName, repositoryName, branchName } =
      getPullRequestArgs;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }
    const pullRequest = await getPullRequestByBranchNameRequest(
      repositoryGroupName,
      repositoryName,
      branchName,
      this.accessToken
    );
    const { links, id: pullRequestId } = pullRequest.values[0];

    return {
      url: links.html.href,
      number: pullRequestId,
    };
  }

  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest> {
    const {
      repositoryGroupName,
      repositoryName,
      branchName,
      defaultBranchName,
      pullRequestTitle,
      pullRequestBody,
    } = createPullRequestArgs;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const pullRequestData = {
      title: pullRequestTitle,
      description: {
        raw: pullRequestBody,
      },
      source: {
        branch: {
          name: branchName,
        },
      },
      destination: {
        branch: {
          name: defaultBranchName,
        },
      },
    };

    const newPullRequest = await createPullRequestFromRequest(
      repositoryGroupName,
      repositoryName,
      pullRequestData,
      this.accessToken
    );

    return {
      url: newPullRequest.links.html.href,
      number: newPullRequest.id,
    };
  }

  async getBranch(args: GetBranchArgs): Promise<Branch | null> {
    const { repositoryGroupName, repositoryName, branchName } = args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }
    const branch = await getBranchRequest(
      repositoryGroupName,
      repositoryName,
      branchName,
      this.accessToken
    );
    return {
      name: branch.name,
      sha: branch.target.hash,
    };
  }

  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    const { repositoryGroupName, repositoryName, branchName, pointingSha } =
      args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const branch = await createBranchRequest(
      repositoryGroupName,
      repositoryName,
      { name: branchName, target: { hash: pointingSha } },
      this.accessToken
    );

    return {
      name: branch.name,
      sha: branch.target.hash,
    };
  }

  async getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit> {
    const { repositoryGroupName, repositoryName, branchName } = args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }
    const firstCommit = await getFirstCommitRequest(
      repositoryGroupName,
      repositoryName,
      branchName,
      this.accessToken
    );

    return {
      sha: firstCommit.hash,
    };
  }

  getCloneUrl(args: CloneUrlArgs): string {
    const { repositoryGroupName, repositoryName, token } = args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }
    return `https://x-token-auth:${token}@bitbucket.org/${repositoryGroupName}/${repositoryName}.git`;
  }

  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    const {
      data: { body },
      where: {
        repositoryGroupName,
        repositoryName,
        issueNumber: pullRequestId,
      },
    } = args;

    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }
    await createCommentOnPrRequest(
      repositoryGroupName,
      repositoryName,
      pullRequestId,
      body,
      this.accessToken
    );
  }

  async getToken(): Promise<string> {
    const authData = await this.refreshAccessToken(this.accessToken);
    return authData.accessToken;
  }

  async getAmplicationBotIdentity(): Promise<Bot | null> {
    return null;
  }
}
