import { Gitlab } from "@gitbeaker/rest";
import { GitbeakerRequestError } from "@gitbeaker/requester-utils";

import axios from "axios";
import { ILogger } from "@amplication/util/logging";
import { GitProvider } from "../../git-provider.interface";
import {
  OAuthTokens,
  Branch,
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  GitProviderCreatePullRequestArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  GetBranchArgs,
  GetFileArgs,
  GitProviderGetPullRequestArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  EnumGitProvider,
  PullRequest,
  PaginatedGitGroup,
  GitLabConfiguration,
  OAuthProviderOrganizationProperties,
  Bot,
  getFolderContentArgs,
  GitFolderContent,
  GitFolderContentItem,
  Commit,
  EnumGitOrganizationType,
} from "../../types";
import { CustomError, NotImplementedError } from "../../utils/custom-error";

export class GitLabService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private auth: OAuthTokens;
  public readonly name = EnumGitProvider.GitLab;
  public readonly domain = "gitlab.com";
  private logger: ILogger;
  private gitlab: InstanceType<typeof Gitlab<true>>;

  constructor(
    private readonly providerOrganizationProperties: OAuthProviderOrganizationProperties,
    private readonly providerConfiguration: GitLabConfiguration,
    logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: GitLabService.name,
      },
    });

    const { accessToken, refreshToken, expiresAt, tokenType, scopes } =
      providerOrganizationProperties;

    this.auth = { accessToken, refreshToken, expiresAt, tokenType, scopes };

    const { clientId, clientSecret, redirectUri } = this.providerConfiguration;
    if (!clientId || !clientSecret || !redirectUri) {
      this.logger.error(
        "Missing GitLab configuration (clientId, clientSecret, redirectUri)"
      );
      throw new Error(
        "Missing GitLab configuration (clientId, clientSecret, redirectUri)"
      );
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;

    this.gitlab = new Gitlab({
      oauthToken: this.auth.accessToken,
      camelize: true,
    });
  }

  async init(): Promise<void> {
    this.logger.info("GitLabService initialized");
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    const scope = "api";
    return Promise.resolve(
      `https://gitlab.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${scope}&state=${amplicationWorkspaceId}`
    );
  }

  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    const response = await axios.post("https://gitlab.com/oauth/token", null, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: authorizationCode,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      },
    });

    const {
      access_token,
      refresh_token,
      token_type,
      expires_in,
      scope,
      created_at,
    } = response.data;

    this.auth.accessToken = access_token;
    this.auth.refreshToken = refresh_token;
    this.auth.tokenType = token_type;
    this.auth.scopes = scope.split(" ");
    this.auth.expiresAt = created_at * 1000 + expires_in * 1000;

    this.gitlab = new Gitlab<true>({
      oauthToken: this.auth.accessToken,
    });

    this.logger.info("GitLabService: Obtained new OAuth tokens");

    return this.auth;
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

    this.logger.info("Token is going to expire, refreshing...");
    return true;
  }

  async refreshAccessTokenIfNeeded(): Promise<OAuthTokens> {
    if (!this.shouldRefreshToken()) {
      return this.auth;
    }

    try {
      const response = await axios.post(
        "https://gitlab.com/oauth/token",
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.auth.refreshToken,
            grant_type: "refresh_token",
          },
        }
      );

      const {
        access_token,
        refresh_token,
        token_type,
        expires_in,
        scope,
        created_at,
      } = response.data;

      this.auth.accessToken = access_token;
      this.auth.refreshToken = refresh_token;
      this.auth.tokenType = token_type;
      this.auth.scopes = scope.split(" ");
      this.auth.expiresAt = created_at * 1000 + expires_in * 1000;

      this.gitlab = new Gitlab({
        oauthToken: this.auth.accessToken,
      });

      this.logger.info("GitLabService: Refreshed OAuth tokens");

      return this.auth;
    } catch (error) {
      throw new CustomError("Failed to refresh token");
    }
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    await this.refreshAccessTokenIfNeeded();
    const user = await this.gitlab.Users.showCurrentUser();
    this.logger.info("GitLabService getCurrentUser");

    return {
      links: {
        avatar: {
          href: user.avatarUrl,
          name: user.username,
        },
      },
      displayName: user.username,
      username: user.username,
      uuid: user.id.toString(),
      useGroupingForRepositories: true,
    };
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    await this.refreshAccessTokenIfNeeded();

    const namespaces = await this.gitlab.Namespaces.all<true, "offset">({
      showExpanded: true,

      perPage: 100,
    });
    const gitGroups = namespaces.data
      .filter((namespace) => namespace.kind === "group")
      .map((namespace) => ({
        id: namespace.id.toString(),
        displayName: namespace.fullPath,
        name: namespace.fullPath,
      }));
    this.logger.info("GitLabService getGitGroups");
    return {
      total: namespaces.paginationInfo.total,
      page: 1,
      pageSize: namespaces.paginationInfo.perPage,
      next: "",
      previous: "",
      groups: gitGroups,
    };
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    await this.refreshAccessTokenIfNeeded();
    const user = await this.gitlab.Users.showCurrentUser();
    this.logger.info("GitLabService getOrganization");

    return {
      name: user.username,
      type: EnumGitOrganizationType.Organization,
      useGroupingForRepositories: true,
    };
  }

  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { groupName, repositoryName } = getRepositoryArgs;

    await this.refreshAccessTokenIfNeeded();

    const projectPath = `${groupName}/${repositoryName}`;
    const project = await this.gitlab.Projects.show(projectPath);

    return {
      name: project.name,
      url: project.webUrl,
      private: project.visibility === "private",
      fullName: project.pathWithNamespace,
      groupName,
      defaultBranch: project.defaultBranch,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const {
      groupName,
      pagination: { perPage, page },
    } = getRepositoriesArgs;

    await this.refreshAccessTokenIfNeeded();

    //const user = await this.gitlab.Users.showCurrentUser();

    //get all projects for the user
    const projects = await this.gitlab.Projects.all<true, "offset">({
      showExpanded: true,
      membership: true,
      perPage,
      page,
      search: groupName,
      searchNamespaces: true,
    });

    const gitRepos = projects.data.map((project) => ({
      id: project.id.toString(),
      name: project.name,
      url: project.webUrl,
      private: project.visibility === "private",
      fullName: `${project.pathWithNamespace}`,
      groupName: project.namespace.fullPath,
      defaultBranch: project.defaultBranch,
    }));

    return {
      repos: gitRepos,
      total: projects.paginationInfo.total,
      pagination: {
        page,
        perPage,
      },
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { groupName, repositoryName, isPrivate } = createRepositoryArgs;

    await this.refreshAccessTokenIfNeeded();

    const visibility = isPrivate ? "private" : "public";

    if (!groupName) {
      this.logger.error("Group name is required");
      throw new CustomError("Group name is required");
    }

    const namespace = await this.gitlab.Namespaces.show(groupName);
    if (!namespace) {
      this.logger.error(`Group ${groupName} not found`);
      throw new CustomError(`Group ${groupName} not found`);
    }

    const project = await this.gitlab.Projects.create({
      name: repositoryName,
      visibility: visibility,
      namespaceId: namespace.id,
    });

    return {
      name: project.name,
      url: project.webUrl,
      private: project.visibility === "private",
      fullName: project.pathWithNamespace,
      groupName,
      defaultBranch: project.defaultBranch,
    };
  }

  async deleteGitOrganization(): Promise<boolean> {
    // GitLab API does not support deleting organizations via API calls
    return true;
  }

  async getBaseOrDefaultBranch(
    groupName: string,
    repositoryName: string,
    ref?: string
  ): Promise<string> {
    await this.refreshAccessTokenIfNeeded();

    const projectPath = `${groupName}/${repositoryName}`;

    if (!ref) {
      // Default to
      const project = await this.gitlab.Projects.show(projectPath);
      return project.defaultBranch;
    }

    return ref;
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    const { repositoryName, path, ref, repositoryGroupName } = file;

    await this.refreshAccessTokenIfNeeded();

    const gitReference = await this.getBaseOrDefaultBranch(
      repositoryGroupName,
      repositoryName,
      ref
    );

    const projectPath = `${repositoryGroupName}/${repositoryName}`;
    try {
      const fileResponse = await this.gitlab.RepositoryFiles.show(
        projectPath,
        path,
        gitReference
      );

      const content = Buffer.from(fileResponse.content, "base64").toString(
        "utf-8"
      );

      this.logger.info("GitLabService getFile");

      return {
        content,
        name: path.split("/").pop() || "",
        path,
      };
    } catch (error) {
      if (
        error instanceof GitbeakerRequestError &&
        error.cause?.response.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  async getFolderContent({
    repositoryName,
    path,
    ref,
    repositoryGroupName,
  }: getFolderContentArgs): Promise<GitFolderContent> {
    await this.refreshAccessTokenIfNeeded();

    const projectPath = `${repositoryGroupName}/${repositoryName}`;
    const gitReference = await this.getBaseOrDefaultBranch(
      repositoryGroupName,
      repositoryName,
      ref
    );

    try {
      const items = await this.gitlab.Repositories.allRepositoryTrees(
        projectPath,
        {
          path,
          ref: gitReference,
          recursive: false,
        }
      );

      const content = items.map((item) => {
        let type: GitFolderContentItem["type"];
        switch (item.type) {
          case "blob":
            type = "File";
            break;
          case "tree":
            type = "Dir";
            break;
          default:
            type = "Other";
        }

        return {
          name: item.name,
          path: item.path,
          type,
        };
      });

      return { content };
    } catch (error) {
      this.logger.error(
        `Failed to fetch folder contents for ${repositoryGroupName}/${repositoryName}/${path}`,
        error
      );
      throw error;
    }
  }

  async createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    //this method is not implemented since we only use "smart sync"
    throw NotImplementedError;
  }

  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<PullRequest | null> {
    const { repositoryName, branchName, repositoryGroupName } =
      getPullRequestArgs;

    await this.refreshAccessTokenIfNeeded();

    const projectId = `${repositoryGroupName}/${repositoryName}`;
    const mergeRequests = await this.gitlab.MergeRequests.all({
      projectId,
      sourceBranch: branchName,
      state: "opened",
    });

    if (mergeRequests[0]) {
      const { webUrl: url, iid } = mergeRequests[0];
      return {
        url,
        number: iid,
      };
    }

    return null;
  }

  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest | null> {
    const {
      repositoryName,
      branchName,
      baseBranchName,
      pullRequestTitle,
      pullRequestBody,
      repositoryGroupName,
    } = createPullRequestArgs;

    await this.refreshAccessTokenIfNeeded();

    if (!repositoryGroupName) {
      throw new CustomError("Base branch name is required");
    }

    const projectId = `${repositoryGroupName}/${repositoryName}`;
    const targetRef = await this.getBaseOrDefaultBranch(
      repositoryGroupName,
      repositoryName,
      baseBranchName
    );

    const mergeRequest = await this.gitlab.MergeRequests.create(
      projectId,
      branchName,
      targetRef,
      pullRequestTitle,
      {
        description: pullRequestBody,
      }
    );

    return {
      url: mergeRequest.webUrl,
      number: mergeRequest.iid,
    };
  }

  async getBranch(args: GetBranchArgs): Promise<Branch | null> {
    const { repositoryName, branchName, repositoryGroupName } = args;

    await this.refreshAccessTokenIfNeeded();

    try {
      const projectId = `${repositoryGroupName}/${repositoryName}`;
      const branch = await this.gitlab.Branches.show(projectId, branchName);
      return {
        name: branch.name,
        sha: branch.commit.id,
      };
    } catch (error) {
      if (
        error instanceof GitbeakerRequestError &&
        error.cause?.response.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    const {
      repositoryName,
      branchName,
      pointingSha,
      baseBranchName,
      repositoryGroupName,
    } = args;

    await this.refreshAccessTokenIfNeeded();

    const projectId = `${repositoryGroupName}/${repositoryName}`;
    const targetRef = await this.getBaseOrDefaultBranch(
      repositoryGroupName,
      repositoryName,
      pointingSha || baseBranchName
    );

    const branch = await this.gitlab.Branches.create(
      projectId,
      branchName,
      targetRef
    );

    return {
      name: branch.name,
      sha: branch.commit.id,
    };
  }

  async getFirstCommitOnBranch(args: GetBranchArgs): Promise<Commit | null> {
    const { repositoryName, branchName, repositoryGroupName } = args;

    await this.refreshAccessTokenIfNeeded();

    const projectId = `${repositoryGroupName}/${repositoryName}`;
    const commits = await this.gitlab.Commits.all(projectId, {
      refName: branchName,
      perPage: 1,
      page: 1,
      order: "asc",
    });

    if (commits.length === 0) {
      return null;
    }

    return {
      sha: commits[0].id,
    };
  }

  async getCloneUrl(args: CloneUrlArgs): Promise<string> {
    const { repositoryName, repositoryGroupName } = args;

    await this.refreshAccessTokenIfNeeded();

    const projectId = `${repositoryGroupName}/${repositoryName}`;

    const project = await this.gitlab.Projects.show(projectId);

    const cloneUrl = project.httpUrlToRepo.replace(
      "https://",
      `https://oauth2:${this.auth.accessToken}@`
    );

    return cloneUrl;
  }

  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    const {
      data: { body },
      where: {
        repositoryName,
        issueNumber: mergeRequestIid,
        repositoryGroupName,
      },
    } = args;

    await this.refreshAccessTokenIfNeeded();

    const projectId = `${repositoryGroupName}/${repositoryName}`;
    await this.gitlab.MergeRequestNotes.create(
      projectId,
      mergeRequestIid,
      body
    );
  }

  async getAmplicationBotIdentity(): Promise<Bot | null> {
    // GitLab does not have an Amplication bot equivalent in this context
    return null;
  }
}
