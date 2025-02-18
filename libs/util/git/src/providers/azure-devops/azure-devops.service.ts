import { ILogger } from "@amplication/util/logging";
import axios from "axios";
import * as azdev from "azure-devops-node-api";
import {
  GitVersionDescriptor,
  GitVersionType,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import {
  ItemContentType,
  VersionControlChangeType,
  VersionControlRecursionType,
} from "azure-devops-node-api/interfaces/TfvcInterfaces";
import { isEmpty } from "lodash";
import { GitProvider } from "../../git-provider.interface";
import {
  AzureDevopsConfiguration,
  Bot,
  Branch,
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  CurrentUser,
  EnumGitOrganizationType,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  getFolderContentArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  GitFolderContent,
  GitFolderContentItem,
  GitProviderCreatePullRequestArgs,
  GitProviderGetPullRequestArgs,
  OAuthProviderOrganizationProperties,
  OAuthTokens,
  PaginatedGitGroup,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "../../types";
import { CustomError } from "../../utils/custom-error";

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

    const { accessToken, refreshToken, expiresAt, username } =
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
    this.organizationUrl = `https://dev.azure.com/${username}`;
    this.scopes = SCOPES;
  }

  async init(): Promise<void> {
    if (!this.auth.accessToken) {
      return; // the provider can only be used for non authenticated operations (creating access token)
    }
    this.initAzureDevOpsClient();

    this.logger.info("AzureDevOpsService initialized");
  }

  private initAzureDevOpsClient(): void {
    const authHandler = azdev.getBearerHandler(this.auth.accessToken);
    this.azureDevOpsClient = new azdev.WebApi(
      this.organizationUrl,
      authHandler
    );
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

      const { access_token, refresh_token, token_type, expires_in, scope } =
        response.data;

      this.auth = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000,
        tokenType: token_type,
        scopes: scope.split(" "),
      };

      this.initAzureDevOpsClient();

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

      this.initAzureDevOpsClient();

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

  async getCurrentOAuthUser(
    accessToken: string,
    state?: string,
    amplicationWorkspaceId?: string
  ): Promise<CurrentUser> {
    try {
      // Establish a connection without specifying an organization
      const authHandler = azdev.getPersonalAccessTokenHandler(accessToken);
      const connection = new azdev.WebApi(
        "https://app.vssps.visualstudio.com",
        authHandler
      );
      const profileApi = await connection.getProfileApi();
      const profile = await profileApi.getProfile("me");
      const userId = profile.id;

      // Use the REST client to call the accounts API
      const restClient = connection.rest;
      const response = await restClient.get<{
        count: number;
        value: { accountName: string; accountId: string }[];
      }>(
        `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${userId}&api-version=6.0`
      );

      if (!response.result || response.result?.count === 0) {
        throw new CustomError("No organizations were found in the account");
      }

      //when a specific state (not workspaceId) is provided, it means that the user is selecting an organization
      if (!isEmpty(state) && state !== amplicationWorkspaceId) {
        const selectedOrganization = response.result.value.find(
          (org) => org.accountName === state
        );

        if (!selectedOrganization) {
          throw new CustomError("The provided organization name was not found");
        }

        return {
          displayName: selectedOrganization.accountName,
          username: selectedOrganization.accountName,
          uuid: selectedOrganization.accountId,
          links: {
            avatar: {
              href: "",
              name: "",
            },
          },
          useGroupingForRepositories: true,
        };
      }

      if (response.result.count > 1) {
        throw new CustomError(
          "User has multiple organizations, please provide the organization name"
        );
      }

      const organization = response.result.value[0];

      return {
        displayName: organization.accountName,
        username: organization.accountName,
        uuid: organization.accountId,
        links: {
          avatar: {
            href: "",
            name: "",
          },
        },
        useGroupingForRepositories: true,
      };
    } catch (error) {
      this.logger.error("Error fetching user data:", undefined, {
        error: error.message,
        data: error.response?.data,
      });
      throw error;
    }
  }

  async getGitGroups(): Promise<PaginatedGitGroup> {
    await this.refreshAccessTokenIfNeeded();

    const coreApi = await this.azureDevOpsClient.getCoreApi();
    const projects = await coreApi.getProjects();
    const groups = projects.map((project) => ({
      id: project.id || "",
      displayName: project.name || "",
      name: project.name || "",
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
      name: repo.name || "",
      url: repo.remoteUrl || "",
      private: true,
      fullName: repo.name || "",
      groupName: groupName,
      defaultBranch: this.parseDefaultBranch(repo.defaultBranch),
    };
  }

  private parseDefaultBranch(defaultBranch?: string): string {
    return defaultBranch?.replace("refs/heads/", "") || "";
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    await this.refreshAccessTokenIfNeeded();

    const { groupName } = getRepositoriesArgs;

    const gitApi = await this.azureDevOpsClient.getGitApi();
    const repos = await gitApi.getRepositories(groupName);
    const remoteRepos = repos.map((repo) => ({
      name: repo.name || "",
      url: repo.webUrl || "",
      private: true,
      fullName: repo.name || "",
      groupName: groupName,
      defaultBranch: this.parseDefaultBranch(repo.defaultBranch),
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

    if (repo && !repo.defaultBranch) {
      //@todo: fetch the default branch name from the organization or project settings
      const defaultBranchName = "main";
      const refName = `refs/heads/${defaultBranchName}`;

      // Push the initial commit
      await gitApi.createPush(
        {
          refUpdates: [
            {
              name: refName,
              oldObjectId: "0000000000000000000000000000000000000000",
            },
          ],
          commits: [
            {
              comment: "Initial commit",
              changes: [
                {
                  changeType: VersionControlChangeType.Add,
                  item: { path: "/README.md" },
                  newContent: {
                    content: "# New Repo\nThis is an auto-generated README.",
                    contentType: ItemContentType.RawText,
                  },
                },
              ],
            },
          ],
        },
        repo.id || "",
        groupName
      );

      // Set the default branch in Azure DevOps
      await gitApi.updateRepository(
        { defaultBranch: refName },
        repo.id || "",
        groupName
      );
    }

    return {
      name: repo.name || "",
      url: repo.remoteUrl || "",
      private: true,
      fullName: repo.name || "",
      groupName: groupName,
      defaultBranch: this.parseDefaultBranch(repo.defaultBranch),
    };
  }

  async deleteGitOrganization(): Promise<boolean> {
    // Deleting an organization is not typically done via API
    return Promise.resolve(true);
  }

  async getBaseOrDefaultBranch(
    groupName: string,
    repositoryName: string,
    ref?: string
  ): Promise<string> {
    await this.refreshAccessTokenIfNeeded();

    if (!ref) {
      const repo = await this.getRepository({
        repositoryName,
        groupName,
        owner: "",
      });

      return repo.defaultBranch;
    }

    return ref;
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, path, ref, repositoryGroupName } = file;

    if (!repositoryGroupName) {
      throw new CustomError("Missing repositoryGroupName");
    }

    const gitApi = await this.azureDevOpsClient.getGitApi();
    try {
      const versionDescriptor: GitVersionDescriptor = {
        version: await this.getBaseOrDefaultBranch(
          repositoryGroupName,
          repositoryName,
          ref
        ),
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

    if (!repositoryGroupName) {
      throw new CustomError("Missing repositoryGroupName");
    }
    const gitApi = await this.azureDevOpsClient.getGitApi();
    const versionDescriptor: GitVersionDescriptor = {
      version: await this.getBaseOrDefaultBranch(
        repositoryGroupName,
        repositoryName,
        ref
      ),
      versionType: GitVersionType.Branch,
    };
    const items = await gitApi.getItems(
      repositoryName,
      repositoryGroupName,
      path,
      VersionControlRecursionType.OneLevel,
      false,
      false,
      false,
      false,
      versionDescriptor
    );
    const content = items
      .filter((item) => item.path !== "/" + path && item.path !== path)
      .map(
        (item) =>
          ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            name: item.path!.split("/").pop() || "",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  private getPullRequestUrl(
    owner: string,
    repositoryGroupName: string,
    repositoryName: string,
    pullRequestId: number
  ): string {
    return `https://${this.domain}/${owner}/${repositoryGroupName}/_git/${repositoryName}/pullrequest/${pullRequestId}`;
  }

  async getPullRequest(
    getPullRequestArgs: GitProviderGetPullRequestArgs
  ): Promise<PullRequest | null> {
    await this.refreshAccessTokenIfNeeded();

    const { repositoryName, branchName, repositoryGroupName, owner } =
      getPullRequestArgs;

    if (!repositoryGroupName) {
      throw new CustomError("Missing repositoryGroupName");
    }

    const gitApi = await this.azureDevOpsClient.getGitApi();
    const prs = await gitApi.getPullRequests(
      repositoryName,
      { sourceRefName: `refs/heads/${branchName}`, status: 1 },
      repositoryGroupName
    );
    if (prs.length > 0) {
      return {
        url: this.getPullRequestUrl(
          owner,
          repositoryGroupName,
          repositoryName,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          prs[0].pullRequestId!
        ),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      owner,
    } = createPullRequestArgs;

    if (!repositoryGroupName) {
      throw new CustomError("Missing repositoryGroupName");
    }

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
      url: this.getPullRequestUrl(
        owner,
        repositoryGroupName,
        repositoryName,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pr.pullRequestId!
      ),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        name: branch.name || "",
        sha: branch.commit?.commitId || "",
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
    const { repositoryGroupName, repositoryName, owner } = args;
    if (!repositoryGroupName) {
      this.logger.error("Missing repositoryGroupName");
      throw new CustomError("Missing repositoryGroupName");
    }

    await this.refreshAccessTokenIfNeeded();

    return Promise.resolve(
      `https://x-token-auth:${this.auth.accessToken}@dev.azure.com/${owner}/${repositoryGroupName}/_git/${repositoryName}`
    );
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
