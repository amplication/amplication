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
  GitProviderArgs,
  PaginatedGitGroup,
} from "../../types";
import { CustomError, NotImplementedError } from "../../utils/custom-error";
import {
  authDataRequest,
  authorizeRequest,
  currentUserRequest,
  currentUserWorkspacesRequest,
  repositoriesInWorkspaceRequest,
  repositoryCreateRequest,
  repositoryRequest,
} from "./requests";
import { ILogger } from "@amplication/util/logging";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string;
  private refreshToken: string;
  public readonly name = EnumGitProvider.Bitbucket;
  public readonly domain = "bitbucket.com";

  constructor(
    private readonly gitProviderArgs: GitProviderArgs,
    private readonly logger: ILogger
  ) {
    const { clientId, clientSecret, accessToken, refreshToken } =
      gitProviderArgs.providerProperties;
    if (!clientId || !clientSecret) {
      this.logger.error("Missing Bitbucket configuration");
      throw new Error("Missing Bitbucket configuration");
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async init(): Promise<void> {
    this.logger.info("BitbucketService init");
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

    const { links, display_name, username, uuid } = currentUser;
    this.logger.info("BitBucketService getCurrentUser");
    return {
      links,
      displayName: display_name,
      username,
      uuid,
    };
  }

  async completeOAuth2Flow(
    authorizationCode: string
  ): Promise<OAuth2FlowResponse> {
    const oAuthData = await this.getAccessToken(authorizationCode);

    const currentUserData = await this.getCurrentUser(
      oAuthData.accessToken,
      oAuthData.refreshToken
    );

    this.logger.info("BitBucketService completeOAuth2Flow");

    return {
      providerProperties: {
        ...oAuthData,
        ...currentUserData,
      },
      useGroupingForRepositories: true,
    };
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    const { accessToken, refreshToken } =
      this.gitProviderArgs.providerProperties;
    const paginatedWorkspaceMembership = await currentUserWorkspacesRequest(
      accessToken,
      this.clientId,
      this.clientSecret,
      refreshToken,
      this.logger
    );

    const { size, page, pagelen, next, previous, values } =
      paginatedWorkspaceMembership;
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
      size,
      page,
      pagelen,
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
    const { gitGroupName, repositoryName } = getRepositoryArgs;

    if (!gitGroupName) {
      this.logger.error("Missing gitGroupName");
      throw new CustomError("Missing gitGroupName");
    }

    const repository = await repositoryRequest(
      gitGroupName,
      repositoryName,
      this.accessToken,
      this.clientId,
      this.clientSecret,
      this.refreshToken,
      this.logger
    );
    const { links, name, is_private, full_name, mainbranch, accessLevel } =
      repository;

    return {
      name,
      url: links.self.href,
      private: is_private,
      fullName: full_name,
      admin: !!(accessLevel === "admin"),
      defaultBranch: mainbranch.name,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const { gitGroupName } = getRepositoriesArgs;

    if (!gitGroupName) {
      this.logger.error("Missing gitGroupName");
      throw new CustomError("Missing gitGroupName");
    }

    const repositoriesInWorkspace = await repositoriesInWorkspaceRequest(
      gitGroupName,
      this.accessToken,
      this.clientId,
      this.clientSecret,
      this.refreshToken,
      this.logger
    );

    const { size, page, pagelen, values } = repositoriesInWorkspace;
    const gitRepos = values.map(
      ({ name, is_private, links, full_name, mainbranch, accessLevel }) => {
        return {
          name,
          url: links.self.href,
          private: is_private,
          fullName: full_name,
          admin: !!(accessLevel === "admin"),
          defaultBranch: mainbranch.name,
        };
      }
    );

    return {
      repos: gitRepos,
      totalRepos: size,
      currentPage: page,
      pageSize: pagelen,
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const {
      gitGroupName,
      repositoryName,
      isPrivateRepository,
      gitOrganization,
    } = createRepositoryArgs;

    if (!gitGroupName) {
      this.logger.error("Missing gitGroupName");
      throw new CustomError("Missing gitGroupName");
    }

    const newRepository = await repositoryCreateRequest(
      gitGroupName,
      repositoryName,
      {
        is_private: isPrivateRepository,
        name: repositoryName,
        full_name: `${gitOrganization.name}/${repositoryName}`,
      },
      this.accessToken,
      this.clientId,
      this.clientSecret,
      this.refreshToken,
      this.logger
    );

    console.log("newRepository", newRepository);

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
