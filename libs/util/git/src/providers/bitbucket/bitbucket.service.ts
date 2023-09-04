import { parse } from "path";
import { GitProvider } from "../../git-provider.interface";
import {
  OAuthTokens,
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
  PaginatedGitGroup,
  BitBucketConfiguration,
  Bot,
  OAuthProviderOrganizationProperties,
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
import { BitbucketNotFoundError } from "./errors";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private auth: OAuthTokens;
  public readonly name = EnumGitProvider.Bitbucket;
  public readonly domain = "bitbucket.com";
  private logger: ILogger;

  constructor(
    providerOrganizationProperties: OAuthProviderOrganizationProperties,
    providerConfiguration: BitBucketConfiguration,
    logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: BitBucketService.name,
      },
    });
    const { accessToken, refreshToken, expiresAt, tokenType, scopes } =
      providerOrganizationProperties;

    this.auth = { accessToken, refreshToken, expiresAt, tokenType, scopes };
    const { clientId, clientSecret } = providerConfiguration;

    if (!clientId || !clientSecret) {
      this.logger.error("Missing Bitbucket configuration");
      throw new Error("Missing Bitbucket configuration");
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async init(): Promise<void> {
    this.logger.info("BitbucketService init");
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return authorizeRequest(this.clientId, amplicationWorkspaceId);
  }

  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    const authData = await authDataRequest(
      this.clientId,
      this.clientSecret,
      authorizationCode
    );

    this.auth.accessToken = authData.access_token;

    this.logger.info("BitBucketService: getAccessToken");

    return {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      scopes: authData.scopes.split(" "),
      tokenType: authData.token_type,
      expiresAt: Date.now() + authData.expires_in * 1000, // 7200 seconds = 2 hours
    };
  }

  private shouldRefreshToken(): boolean {
    const timeInMsLeft = this.auth.expiresAt - Date.now();
    this.logger.debug("Time left before token expires:", {
      value: `${timeInMsLeft / 60000} minutes`,
    });

    if (timeInMsLeft > 5 * 60 * 1000) {
      this.logger.debug("Token is still valid");
      return false;
    }

    this.logger.info("Token is going to be expired, refreshing...");
    return true;
  }

  async refreshAccessTokenIfNeeded(): Promise<OAuthTokens> {
    if (!this.shouldRefreshToken()) {
      return this.auth;
    }

    const newOAuthTokens = await refreshTokenRequest(
      this.clientId,
      this.clientSecret,
      this.auth.refreshToken
    );

    this.logger.info("BitBucketService: refreshAccessTokenIfNeeded");
    this.auth.accessToken = newOAuthTokens.access_token;

    return {
      accessToken: newOAuthTokens.access_token,
      refreshToken: newOAuthTokens.refresh_token,
      scopes: newOAuthTokens.scopes.split(" "),
      tokenType: newOAuthTokens.token_type,
      expiresAt: Date.now() + newOAuthTokens.expires_in * 1000, // 7200 seconds = 2 hours
    };
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    const currentUser = await currentUserRequest(accessToken);
    const { links, display_name, username, uuid } = currentUser;

    this.logger.info("BitBucketService getCurrentUser");
    return {
      links: {
        avatar: links.avatar,
      },
      displayName: display_name,
      username,
      uuid,
      useGroupingForRepositories: true,
    };
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    await this.refreshAccessTokenIfNeeded();

    const paginatedWorkspaceMembership = await currentUserWorkspacesRequest(
      this.auth.accessToken
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
        displayName: name,
        name: slug,
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
    const { groupName, repositoryName } = getRepositoryArgs;

    if (!groupName) {
      this.logger.error("Missing groupName");
      throw new CustomError("Missing groupName");
    }

    await this.refreshAccessTokenIfNeeded();

    const repository = await repositoryRequest(
      groupName,
      repositoryName,
      this.auth.accessToken
    );
    const { links, name, is_private, full_name, mainbranch, accessLevel } =
      repository;

    return {
      name,
      url: links.html.href,
      private: is_private,
      fullName: full_name,
      admin: !!(accessLevel === "admin"),
      groupName: groupName,
      defaultBranch: mainbranch.name,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const {
      groupName,
      pagination: { page, perPage },
    } = getRepositoriesArgs;

    if (!groupName) {
      this.logger.error("Missing groupName");
      throw new CustomError("Missing groupName");
    }

    await this.refreshAccessTokenIfNeeded();

    const repositoriesInWorkspace = await repositoriesInWorkspaceRequest(
      groupName,
      perPage,
      page,
      this.auth.accessToken
    );

    const { size, values } = repositoriesInWorkspace;
    const gitRepos = values.map(
      ({ name, is_private, links, full_name, mainbranch, accessLevel }) => {
        return {
          name,
          url: links.html.href,
          private: is_private,
          fullName: full_name,
          groupName: groupName,
          admin: !!(accessLevel === "admin"),
          defaultBranch: mainbranch.name,
        };
      }
    );

    return {
      repos: gitRepos,
      total: size,
      pagination: {
        page,
        perPage,
      },
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { groupName, repositoryName, isPrivate, gitOrganization } =
      createRepositoryArgs;

    if (!groupName) {
      this.logger.error("Missing groupName");
      throw new CustomError("Missing groupName");
    }

    await this.refreshAccessTokenIfNeeded();

    const newRepository = await repositoryCreateRequest(
      groupName,
      repositoryName,
      {
        is_private: isPrivate,
        name: repositoryName,
        full_name: `${gitOrganization.name}/${repositoryName}`,
      },
      this.auth.accessToken
    );

    return {
      name: newRepository.name,
      url: "https://bitbucket.org/" + newRepository.full_name,
      private: newRepository.is_private,
      fullName: newRepository.full_name,
      admin: !!(newRepository.accessLevel === "admin"),
      groupName,
      defaultBranch: newRepository.mainbranch.name,
    };
  }

  deleteGitOrganization(): Promise<boolean> {
    // Nothing bitbucket integration works on authentication on behalf of user.
    // There is nothing to uninstall/delete when an organization is deleted.
    return new Promise(() => true);
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    let gitReference: string;
    const { owner, repositoryName, repositoryGroupName, ref, path } = file;

    if (!repositoryGroupName) {
      throw new CustomError(
        "Missing repositoryGroupName. repositoryGroupName is mandatory for BitBucket provider"
      );
    }

    if (!ref) {
      // Default to
      const repo = await this.getRepository({
        owner,
        repositoryName,
        groupName: repositoryGroupName,
      });
      gitReference = repo.defaultBranch;
    } else {
      gitReference = ref;
    }

    await this.refreshAccessTokenIfNeeded();

    const fileResponse = await getFileMetaRequest(
      repositoryGroupName,
      repositoryName,
      gitReference,
      path,
      this.auth.accessToken
    );

    const fileBufferResponse = await getFileRequest(
      repositoryGroupName,
      repositoryName,
      gitReference,
      path,
      this.auth.accessToken
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
  ): Promise<PullRequest | null> {
    const { repositoryGroupName, repositoryName, branchName } =
      getPullRequestArgs;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    await this.refreshAccessTokenIfNeeded();

    const pullRequest = await getPullRequestByBranchNameRequest(
      repositoryGroupName,
      repositoryName,
      branchName,
      this.auth.accessToken
    );
    if (pullRequest.values[0]) {
      const { links, id: pullRequestId } = pullRequest.values[0];

      return {
        url: links.html.href,
        number: pullRequestId,
      };
    }
    return null;
  }

  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest | null> {
    const {
      repositoryGroupName,
      repositoryName,
      branchName,
      baseBranchName,
      pullRequestTitle,
      pullRequestBody,
    } = createPullRequestArgs;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    const pullRequestData = {
      title: pullRequestTitle,
      description: pullRequestBody,
      source: {
        branch: {
          name: branchName,
        },
      },
      destination: {
        branch: {
          name: baseBranchName,
        },
      },
    };

    await this.refreshAccessTokenIfNeeded();

    const newPullRequest = await createPullRequestFromRequest(
      repositoryGroupName,
      repositoryName,
      pullRequestData,
      this.auth.accessToken
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

    await this.refreshAccessTokenIfNeeded();

    try {
      const branch = await getBranchRequest(
        repositoryGroupName,
        repositoryName,
        branchName,
        this.auth.accessToken
      );
      return {
        name: branch.name,
        sha: branch.target.hash,
      };
    } catch (error) {
      if (error instanceof BitbucketNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    const { repositoryGroupName, repositoryName, branchName, pointingSha } =
      args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    await this.refreshAccessTokenIfNeeded();

    const branch = await createBranchRequest(
      repositoryGroupName,
      repositoryName,
      { name: branchName, target: { hash: pointingSha } },
      this.auth.accessToken
    );

    return {
      name: branch.name,
      sha: branch.target.hash,
    };
  }

  async getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit | null> {
    try {
      const { repositoryGroupName, repositoryName, branchName } = args;
      if (!repositoryGroupName) {
        this.logger.error("Missing repositoryGroupName");
        throw new CustomError("Missing repositoryGroupName");
      }

      await this.refreshAccessTokenIfNeeded();

      const firstCommit = await getFirstCommitRequest(
        repositoryGroupName,
        repositoryName,
        branchName,
        this.auth.accessToken
      );

      return {
        sha: firstCommit.hash,
      };
    } catch (error) {
      if (error instanceof BitbucketNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async getCloneUrl(args: CloneUrlArgs): Promise<string> {
    const { repositoryGroupName, repositoryName } = args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    await this.refreshAccessTokenIfNeeded();

    return Promise.resolve(
      `https://x-token-auth:${this.auth.accessToken}@bitbucket.org/${repositoryGroupName}/${repositoryName}.git`
    );
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

    await this.refreshAccessTokenIfNeeded();

    await createCommentOnPrRequest(
      repositoryGroupName,
      repositoryName,
      pullRequestId,
      body,
      this.auth.accessToken
    );
  }

  async getAmplicationBotIdentity(): Promise<Bot | null> {
    return null;
  }
}
