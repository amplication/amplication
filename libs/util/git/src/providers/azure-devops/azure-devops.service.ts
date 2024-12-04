import * as azdev from "azure-devops-node-api";
import { GitProvider } from "../../git-provider.interface";
import {
  Branch,
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  GitProviderCreatePullRequestArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  EnumGitOrganizationType,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GitProviderGetPullRequestArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  OAuthTokens,
  PaginatedGitGroup,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  getFolderContentArgs,
  GitFolderContent,
  Bot,
  AzureDevopsConfiguration,
  OAuthProviderOrganizationProperties,
  GitFolderContentItem,
} from "../../types";
import { ILogger } from "@amplication/util/logging";
import { CustomError } from "../../utils/custom-error";
import {
  GitVersionDescriptor,
  GitVersionType,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import axios from "axios";

const SCOPES = [
  "499b84ac-1321-427f-aa17-267ca6975798/.default",
  "offline_access",
];

const OAUTH_AUTHORITY = "https://login.microsoftonline.com";

export class AzureDevOpsService implements GitProvider {
  public readonly name = EnumGitProvider.AzureDevOps;
  public readonly domain = "dev.azure.com";
  private auth: OAuthTokens;
  private logger: ILogger;
  private azureDevOpsClient: azdev.WebApi;
  private organizationUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private redirectUri: string;
  private scopes: string[];

  constructor(
    private readonly providerOrganizationProperties: OAuthProviderOrganizationProperties,
    private readonly providerConfiguration: AzureDevopsConfiguration,
    logger: ILogger
  ) {
    this.logger = logger.child({
      metadata: {
        className: AzureDevOpsService.name,
      },
    });

    const { accessToken, refreshToken, expiresAt } =
      providerOrganizationProperties;

    this.auth = {
      accessToken,
      refreshToken,
      expiresAt,
      tokenType: "Bearer",
      scopes: SCOPES,
    };

    const { clientId, clientSecret, tenantId, redirectUri } =
      providerConfiguration;

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenantId = tenantId;
    this.redirectUri = redirectUri;
    this.organizationUrl = `https://dev.azure.com/${"organization"}`;
    this.scopes = SCOPES;
  }

  async init(): Promise<void> {
    // await this.refreshAccessTokenIfNeeded();
    // const authHandler = azdev.getBearerHandler(this.auth.accessToken);
    // this.azureDevOpsClient = new azdev.WebApi(
    //   this.organizationUrl,
    //   authHandler
    // );
    this.logger.info("AzureDevOpsService initialized");
  }

  getAuthData(): Promise<OAuthTokens> {
    return Promise.resolve(this.auth);
  }

  isAuthDataRefreshed(): Promise<boolean> {
    // Implement logic if token was refreshed
    return Promise.resolve(false);
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    const authorizationUri = `${OAUTH_AUTHORITY}/${this.tenantId}/oauth2/v2.0/authorize`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      response_mode: "query",
      scope: this.scopes.join(" "),
      state: amplicationWorkspaceId,
    });

    return `${authorizationUri}?${params.toString()}`;
  }

  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    try {
      const bodyData = new URLSearchParams();
      bodyData.append("client_id", this.clientId);
      bodyData.append("client_secret", this.clientSecret);
      bodyData.append("code", authorizationCode);
      bodyData.append("grant_type", "authorization_code");
      bodyData.append("redirect_uri", this.redirectUri);

      const response = await axios.post(
        `${OAUTH_AUTHORITY}/${this.tenantId}/oauth2/v2.0/token`,
        bodyData.toString(), // Convert to URL-encoded string
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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

      this.auth = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000,
        tokenType: token_type,
        scopes: scope.split(" "),
      };

      this.logger.info("Obtained new OAuth tokens");
      return this.auth;
    } catch (error) {
      this.logger.error("Error obtaining OAuth tokens:", undefined, {
        error: error.message,
      });
      throw error;
    }
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

    const tokenUrl = `${OAUTH_AUTHORITY}/${this.tenantId}/oauth2/v2.0/token`;
    const tokenConfig = {
      grant_type: "refresh_token",
      refresh_token: this.auth.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: this.scopes.join(" "),
    };

    try {
      // Send token refresh request using Axios
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams(tokenConfig).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data;

      this.auth = {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: Date.now() + token.expires_in * 1000,
        tokenType: token.token_type,
        scopes: token.scope.split(" "),
      };

      this.logger.info("Refreshed OAuth tokens");
      return this.auth;
    } catch (error) {
      this.logger.error(
        "Error refreshing access token:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    await this.refreshAccessTokenIfNeeded();

    const coreApi = await this.azureDevOpsClient.getCoreApi();
    const profile = await coreApi.getProjects();

    return {
      displayName: "profile.displayName",
      username: "profile.emailAddress || profile.displayName",
      uuid: "profile.id",
      links: {
        avatar: {
          href: "profile._links.avatar.href",
          name: "profile.displayName",
        },
      },
      useGroupingForRepositories: false,
    };
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    await this.refreshAccessTokenIfNeeded();

    const coreApi = await this.azureDevOpsClient.getCoreApi();
    const projects = await coreApi.getProjects();
    const groups = projects.map((project) => ({
      id: project.id!,
      displayName: project.name!,
      name: project.name!,
    }));
    return {
      total: groups.length,
      page: 1,
      pageSize: groups.length,
      next: "",
      previous: "",
      groups,
    };
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    return {
      name: "this.providerConfiguration.organization",
      type: EnumGitOrganizationType.Organization,
      useGroupingForRepositories: true,
    };
  }

  async getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { repositoryName, groupName } = getRepositoryArgs;
    await this.refreshAccessTokenIfNeeded();

    const gitApi = await this.azureDevOpsClient.getGitApi();
    const repo = await gitApi.getRepository(repositoryName, groupName);

    return {
      name: repo.name!,
      url: repo.remoteUrl!,
      private: true,
      fullName: repo.name!,
      groupName: groupName,
      defaultBranch: repo.defaultBranch!.replace("refs/heads/", ""),
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    await this.refreshAccessTokenIfNeeded();

    const { groupName } = getRepositoriesArgs;

    const gitApi = await this.azureDevOpsClient.getGitApi();
    const repos = await gitApi.getRepositories(groupName);
    const remoteRepos = repos.map((repo) => ({
      name: repo.name!,
      url: repo.remoteUrl!,
      private: true,
      fullName: repo.name!,
      groupName: groupName,
      defaultBranch: repo.defaultBranch!.replace("refs/heads/", ""),
    }));
    return {
      repos: remoteRepos,
      total: remoteRepos.length,
      pagination: {
        page: 1,
        perPage: remoteRepos.length,
      },
    };
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, groupName } = createRepositoryArgs;

    if (!groupName) {
      throw new CustomError("Group name is required");
    }

    const gitApi = await this.azureDevOpsClient.getGitApi();
    const createOptions = {
      name: repositoryName,
    };
    const repo = await gitApi.createRepository(createOptions, groupName);

    return {
      name: repo.name!,
      url: repo.remoteUrl!,
      private: true,
      fullName: repo.name!,
      groupName: groupName,
      defaultBranch: "master",
    };
  }

  async deleteGitOrganization(): Promise<boolean> {
    // Deleting an organization is not typically done via API
    return Promise.resolve(true);
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, path, ref, repositoryGroupName } = file;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    try {
      const versionDescriptor: GitVersionDescriptor = {
        version: ref || "master",
        versionType: GitVersionType.Branch,
      };
      const itemContent = await gitApi.getItemContent(
        repositoryName,
        path,
        repositoryGroupName,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        versionDescriptor
      );
      const content = itemContent.toString();
      return {
        content,
        name: path.split("/").pop() || "",
        path,
      };
    } catch (error) {
      this.logger.error("Error fetching file:", error);
      return null;
    }
  }

  async getFolderContent(
    args: getFolderContentArgs
  ): Promise<GitFolderContent> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, path, ref, repositoryGroupName } = args;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const versionDescriptor: GitVersionDescriptor = {
      version: ref || "master",
      versionType: GitVersionType.Branch,
    };
    const items = await gitApi.getItems(
      repositoryName,
      repositoryGroupName,
      path,
      undefined,
      false,
      false,
      false,
      false,
      versionDescriptor
    );
    const content = items.map(
      (item) =>
        ({
          name: item.path!.split("/").pop() || "",
          path: item.path!,
          type: item.isFolder ? "Dir" : "File",
        } as GitFolderContentItem)
    );
    return { content };
  }

  async createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    // Implement the logic to create a pull request from files
    throw new Error("Method not implemented.");
  }

  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<PullRequest | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, branchName, repositoryGroupName } =
      getPullRequestArgs;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const prs = await gitApi.getPullRequests(
      repositoryName,
      { sourceRefName: `refs/heads/${branchName}`, status: 1 },
      repositoryGroupName
    );
    if (prs.length > 0) {
      return {
        url: prs[0]._links.web.href,
        number: prs[0].pullRequestId!,
      };
    }
    return null;
  }

  async createPullRequest(
    createPullRequestArgs: GitProviderCreatePullRequestArgs
  ): Promise<PullRequest | null> {
    await this.refreshAccessTokenIfNeeded();

    const {
      repositoryName,
      branchName,
      baseBranchName,
      pullRequestTitle,
      pullRequestBody,
      repositoryGroupName,
    } = createPullRequestArgs;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const gitPullRequestToCreate = {
      sourceRefName: `refs/heads/${branchName}`,
      targetRefName: `refs/heads/${baseBranchName}`,
      title: pullRequestTitle,
      description: pullRequestBody,
    };
    const pr = await gitApi.createPullRequest(
      gitPullRequestToCreate,
      repositoryName,
      repositoryGroupName
    );
    return {
      url: pr._links.web.href,
      number: pr.pullRequestId!,
    };
  }

  async getBranch(args: GetBranchArgs): Promise<Branch | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, branchName, repositoryGroupName } = args;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    try {
      const branch = await gitApi.getBranch(
        repositoryName,
        branchName,
        repositoryGroupName
      );
      return {
        name: branch.name!,
        sha: branch.commit!.commitId!,
      };
    } catch (error) {
      this.logger.error("Error fetching branch:", error);
      return null;
    }
  }

  async createBranch(args: CreateBranchArgs): Promise<Branch> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, branchName, pointingSha, repositoryGroupName } =
      args;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const refUpdates = [
      {
        name: `refs/heads/${branchName}`,
        oldObjectId: "0000000000000000000000000000000000000000",
        newObjectId: pointingSha,
      },
    ];
    await gitApi.updateRefs(refUpdates, repositoryName, repositoryGroupName);
    return {
      name: branchName,
      sha: pointingSha,
    };
  }

  async getCloneUrl(args: CloneUrlArgs): Promise<string> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, repositoryGroupName } = args;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const repo = await gitApi.getRepository(
      repositoryName,
      repositoryGroupName
    );
    return repo.remoteUrl!;
  }

  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    await this.refreshAccessTokenIfNeeded();

    const {
      data: { body },
      where: { repositoryName, issueNumber, repositoryGroupName },
    } = args;
    const gitApi = await this.azureDevOpsClient.getGitApi();
    await gitApi.createThread(
      {
        comments: [
          {
            content: body,
            commentType: 1, // Text
          },
        ],
      },
      repositoryName,
      issueNumber,
      repositoryGroupName
    );
  }

  async getAmplicationBotIdentity(): Promise<Bot | null> {
    // Implement if there's a bot user
    return null;
  }
}
