import { ILogger } from "@amplication/util/logging";
import * as Resources from "@gitbeaker/core";
import { Gitlab } from "@gitbeaker/rest";
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
  OAuthConfiguration,
} from "../../types";
import { NotImplementedError } from "../../utils/custom-error";

export class GitLabService implements GitProvider {
  public readonly name = EnumGitProvider.GitLab;
  private readonly gitCrentials: {
    username: string;
    password: string;
  };
  private client: Resources.Gitlab;
  private auth: OAuthTokens;

  constructor(
    providerOrganizationProperties: OAuthProviderOrganizationProperties,
    private readonly providerConfiguration: OAuthConfiguration,
    private readonly logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: GitLabService.name,
      },
    });
    this.auth = providerOrganizationProperties;
  }

  async init(): Promise<void> {
    const timeInMsLeft = this.auth.expiresAt - Date.now();
    this.logger.debug("Time left before token expires:", {
      value: `${timeInMsLeft / 60000} minutes`,
    });

    if (timeInMsLeft < 5 * 60 * 1000) {
      this.logger.debug("Token is going to be expired, refreshing...");
      this.auth = await this.refreshAccessToken();
    }

    if (this.auth.expiresAt - Date.now() / 1000 < 5000) {
      this.auth = await this.refreshAccessToken();
    }

    this.client = new Gitlab({
      oauthToken: this.auth.accessToken,
      host: this.providerConfiguration.domain,
    });
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    const { redirectUri } = this.auth;
    if (!redirectUri) {
      throw new Error("providerConfiguration.redirectUri is required");
    }
    const scopes = "api";
    // const scopes =
    //   "api+read_user+read_repository+write_repository+email+profile";
    const parameters = `client_id=${this.providerConfiguration.clientId}&redirect_uri=${redirectUri}&response_type=code&state=${amplicationWorkspaceId}&scope=${scopes}`;

    return `${this.providerConfiguration.domain}/oauth/authorize?${parameters}`;
  }
  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    const api = new Gitlab({
      oauthToken: accessToken,
    });
    const user = await api.Users.showCurrentUser();

    return {
      displayName: user.name,
      uuid: user.id.toString(),
      username: user.username,
      useGroupingForRepositories: false,
      links: {
        avatar: {
          href: user.avatar_url,
          name: user.name,
        },
      },
    };
  }
  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    const url = `${this.providerConfiguration.domain}/oauth/token`;
    const { redirectUri } = this.auth;
    const parameters = `client_id=${this.providerConfiguration.clientId}&client_secret=${this.providerConfiguration.clientSecret}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${redirectUri}`;

    const response = await fetch(`${url}?${parameters}`, {
      method: "POST",
    });
    if (response?.ok) {
      const authData = await response.json();

      return {
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        tokenType: authData.token_type,
        expiresAt: Date.now() + authData.expires_in * 1000, // 7200 seconds = 2 hours
        scopes: [],
        redirectUri,
      };
    } else {
      throw new Error(`Failed to get OAuth tokens: ${response.statusText}`);
    }
  }

  private async refreshAccessToken(): Promise<OAuthTokens> {
    const url = `${this.providerConfiguration.domain}/oauth/token`;
    const parameters = `client_id=${this.providerConfiguration.clientId}&client_secret=${this.providerConfiguration.clientSecret}&refresh_token=${this.auth.refreshToken}&grant_type=refresh_token&redirect_uri=${this.auth.redirectUri}`;
    const response = await fetch(`${url}?${parameters}`, {
      method: "POST",
    });
    if (response?.ok) {
      const authData = await response.json();

      return {
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        tokenType: authData.token_type,
        expiresAt: Date.now() + authData.expires_in * 1000, // 7200 seconds = 2 hours
        scopes: [],
        redirectUri: this.auth.redirectUri,
      };
    } else {
      throw new Error(
        `Failed to get OAuth tokens from refreshAccessToken: ${response.statusText}`
      );
    }
  }
  async getGitGroups(): Promise<PaginatedGitGroup> {
    throw NotImplementedError;
  }
  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    this.client.Projects.all({});
    throw NotImplementedError;
  }
  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    getRepositoriesArgs.pagination.perPage = 100;
    const projects = await this.client.Projects.all({
      archived: false,
      orderBy: "updated_at",
      sort: "asc",
      membership: true,
      pagination: "offset",
      perPage: getRepositoriesArgs.pagination.perPage,
      page: getRepositoriesArgs.pagination.page,
    });

    return {
      pagination: {
        page: 1,
        perPage: projects.length,
      },
      total: projects.length,
      repos: projects.map(
        (project) =>
          <RemoteGitRepository>{
            name: project.path_with_namespace,
            defaultBranch: project.default_branch,
            fullName: project.path_with_namespace,
            private: project.visibility === "private",
            url: project.http_url_to_repo,
            groupName: "",
            admin: false,
          }
      ),
    };
  }
  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    const repo = await this.client.Projects.create({
      path: createRepositoryArgs.repositoryName,
      visibility: createRepositoryArgs.isPrivate ? "private" : "public",
    });

    return {
      defaultBranch: repo.default_branch,
      fullName: repo.path_with_namespace,
      name: repo.path_with_namespace,
      private: repo.visibility === "private",
      url: repo.http_url_to_repo,
      admin: false,
    };
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
