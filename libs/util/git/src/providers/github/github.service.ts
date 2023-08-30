import { ILogger } from "@amplication/util/logging";
import { createAppAuth } from "@octokit/auth-app";
import { components } from "@octokit/openapi-types";
import { App, Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import {
  Changes,
  UpdateFunction,
} from "octokit-plugin-create-pull-request/dist-types/types";
import { GitProvider } from "../../git-provider.interface";
import {
  Branch,
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  GitProviderCreatePullRequestArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  EnumGitOrganizationType,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GitProviderGetPullRequestArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  Bot,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  UpdateFile,
  PaginatedGitGroup,
  GitHubConfiguration,
  OAuthTokens,
  CurrentUser,
  GitHubProviderOrganizationProperties,
  Commit,
} from "../../types";
import { ConverterUtil } from "../../utils/convert-to-number";
import { NotImplementedError } from "../../utils/custom-error";
import { UNSUPPORTED_GIT_ORGANIZATION_TYPE } from "../../git.constants";

const GITHUB_FILE_TYPE = "file";

type DirectoryItem = components["schemas"]["content-directory"][number];

export class GithubService implements GitProvider {
  private app: App;
  private appId: string;
  private privateKey: string;
  private gitInstallationUrl: string;
  private installationId: string;
  private octokit: Octokit;
  public readonly name = EnumGitProvider.Github;
  public readonly domain = "github.com";
  constructor(
    private readonly providerOrganizationProperties: GitHubProviderOrganizationProperties,
    private readonly providerConfiguration: GitHubConfiguration,
    private readonly logger: ILogger
  ) {}

  async init(): Promise<void> {
    const {
      appId,
      privateKey: envPrivateKey,
      installationUrl,
    } = this.providerConfiguration;

    this.gitInstallationUrl = installationUrl;
    this.appId = appId;
    this.privateKey = envPrivateKey;
    this.installationId = this.providerOrganizationProperties.installationId;

    if (!appId || !envPrivateKey || !installationUrl) {
      this.logger.error("Missing Github configuration");
      throw new Error("Missing Github configuration");
    }

    const privateKey = this.getFormattedPrivateKey(this.privateKey);
    this.app = new App({
      appId: this.appId,
      privateKey,
    });

    if (this.installationId) {
      this.octokit = await this.getInstallationOctokit(this.installationId);
    }
  }

  async getCloneUrl({ owner, repositoryName }: CloneUrlArgs): Promise<string> {
    const token = await this.getToken();
    return `https://x-access-token:${token}@${this.domain}/${owner}/${repositoryName}.git`;
  }

  async getAmplicationBotIdentity(): Promise<Bot | null> {
    const data: {
      viewer: { id: string; login: string };
    } = await this.octokit.graphql(
      `{
      viewer {
        id
        login
      }
    }`,
      {}
    );

    const { id, login } = data.viewer;
    // amplication[bot] <123123+amplication[bot]@users.noreply.github.com>
    const oldAmplicationBotPattern = `${login} <\\d+\\+${login}@user\\.noreply\\.github\\.com>`;

    return {
      id,
      login,
      gitAuthor: oldAmplicationBotPattern,
    };
  }

  private getFormattedPrivateKey(privateKey: string): string {
    return privateKey.replace(/\\n/g, "\n");
  }

  private async getInstallationAuthToken(
    installationId: string
  ): Promise<string> {
    const privateKey = this.getFormattedPrivateKey(this.privateKey);
    const auth = createAppAuth({
      appId: this.appId,
      privateKey,
    });
    // Retrieve installation access token
    return (
      await auth({
        type: "installation",
        installationId: installationId,
      })
    ).token;
  }

  private async getInstallationOctokit(
    installationId: string
  ): Promise<Octokit> {
    const installationIdNumber = ConverterUtil.convertToNumber(installationId);
    return await this.app.getInstallationOctokit(installationIdNumber);
  }

  private async getOrganizationRepositories(): Promise<RemoteGitRepository[]> {
    const results = await this.octokit.request(
      "GET /installation/repositories"
    );
    return results.data.repositories.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions?.admin || false,
      defaultBranch: repo.default_branch,
    }));
  }

  private async isRepositoryInOrganizationRepositories(
    name: string
  ): Promise<boolean> {
    const repos = await this.getOrganizationRepositories();
    return repos.map((repo) => repo.name).includes(name);
  }

  private async getRepositoriesWithPagination(
    perPage = 10,
    page = 1
  ): Promise<RemoteGitRepos> {
    const results = await this.octokit.request(
      `GET /installation/repositories?per_page=${perPage}&page=${page}`
    );
    const repos = results.data.repositories.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin,
    }));

    return {
      total: results.data.total_count,
      repos: repos,
      pagination: {
        perPage,
        page,
      },
    };
  }

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.gitInstallationUrl.replace("{state}", amplicationWorkspaceId);
  }

  async getRepository(
    getRepositoriesArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { owner, repositoryName } = getRepositoriesArgs;
    const { data } = await this.octokit.rest.repos.get({
      owner,
      repo: repositoryName,
    });
    const {
      permissions,
      url,
      private: isPrivate,
      name,
      full_name: fullName,
      default_branch: defaultBranch,
    } = data;
    const baseRepository = {
      defaultBranch,
      fullName,
      name: repositoryName,
      private: isPrivate,
      url,
    };
    if (!permissions) {
      return { ...baseRepository, admin: false };
    }
    const { admin } = permissions;
    return {
      admin,
      defaultBranch,
      fullName,
      name,
      private: isPrivate,
      url,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const {
      pagination: { perPage, page },
    } = getRepositoriesArgs;
    return await this.getRepositoriesWithPagination(perPage, page);
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    const { gitOrganization, owner, repositoryName, isPrivate } =
      createRepositoryArgs;

    if (gitOrganization.type === EnumGitOrganizationType.User) {
      throw new Error(UNSUPPORTED_GIT_ORGANIZATION_TYPE);
    }

    const exists: boolean = await this.isRepositoryInOrganizationRepositories(
      repositoryName
    );
    if (exists) {
      return null;
    }

    const { data: repo } = await this.octokit.rest.repos.createInOrg({
      name: repositoryName,
      org: owner,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      auto_init: true,
      private: isPrivate,
    });

    return {
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions?.admin || false,
      defaultBranch: repo.default_branch,
    };
  }

  async deleteGitOrganization(): Promise<boolean> {
    const deleteInstallationRes =
      await this.octokit.rest.apps.deleteInstallation({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        installation_id: ConverterUtil.convertToNumber(this.installationId),
      });

    if (deleteInstallationRes.status != 204) {
      return false;
    }

    return true;
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    const gitRemoteOrganization = await this.octokit.rest.apps.getInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: ConverterUtil.convertToNumber(this.installationId),
    });
    const { data: gitRemoteOrgs } = gitRemoteOrganization;
    const { account } = gitRemoteOrgs;
    if (!account) {
      throw new Error("Account not found");
    }
    const { login, type } = account;
    if (!type) {
      throw new Error("Account type not found");
    }
    if (!login) {
      throw new Error("Account login not found");
    }
    return {
      name: login,
      type: EnumGitOrganizationType[type],
      useGroupingForRepositories: false, // with GitHub, we don't have the option to use grouping
    };
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    const { owner, repositoryName, path, ref } = file;

    const content = await this.octokit.rest.repos.getContent({
      owner,
      repo: repositoryName,
      path,
      ref,
    });

    if (!Array.isArray(content)) {
      const item = content.data as DirectoryItem;
      if (!item.content) {
        return null;
      }
      if (item.type === GITHUB_FILE_TYPE) {
        // Convert base64 results to UTF-8 string
        const buff = Buffer.from(item.content, "base64");

        const file: GitFile = {
          content: buff.toString("utf-8"),
          name: item.name,
          path: item.path,
        };
        return file;
      }
    }
    return null;
  }

  async createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    const {
      owner,
      repositoryName,
      pullRequestTitle,
      pullRequestBody,
      branchName,
      files,
      commitMessage,
    } = createPullRequestFromFilesArgs;
    // We are not using this.octokit, instead we are using a local octokit client because we need the plugin
    const octokitWithPlugins = Octokit.plugin(createPullRequest);
    const token = await this.getInstallationAuthToken(this.installationId);
    const octokit = new octokitWithPlugins({
      auth: token,
    });

    const gitHubFiles = this.convertFilesToGitHubFiles(files);
    const pr = await octokit.createPullRequest({
      owner,
      repo: repositoryName,
      title: pullRequestTitle,
      body: pullRequestBody,
      head: branchName,
      update: true,
      changes: [
        {
          /* optional: if `files` is not passed, an empty commit is created instead */
          files: gitHubFiles,
          commit: commitMessage,
        },
      ],
    });
    if (pr === null) {
      throw new Error("We had a problem creating the pull request");
    }
    return pr.data.html_url;
  }

  async getPullRequest({
    owner,
    repositoryName,
    branchName,
  }: GitProviderGetPullRequestArgs): Promise<PullRequest | null> {
    const branchInfo: {
      repository: {
        ref: {
          associatedPullRequests: {
            edges: [
              {
                node: {
                  url: string;
                  number: number;
                };
              }
            ];
          };
        };
      };
    } = await this.octokit.graphql(
      `
          query ($owner: String!, $repo: String!, $head: String!) {
            repository(name: $repo, owner: $owner) {
              ref(qualifiedName: $head) {
                associatedPullRequests(first: 1, states: OPEN) {
                  edges {
                    node {
                      id
                      number
                      url
                    }
                  }
                }
              }
            }
          }`,
      {
        owner,
        repo: repositoryName,
        head: branchName,
      }
    );

    const existingPullRequest =
      branchInfo.repository.ref?.associatedPullRequests?.edges?.[0]?.node;

    return existingPullRequest || null;
  }

  async createPullRequest({
    owner,
    repositoryName,
    branchName,
    pullRequestTitle,
    pullRequestBody,
    baseBranchName,
  }: GitProviderCreatePullRequestArgs): Promise<PullRequest | null> {
    try {
      const { data: pullRequest } = await this.octokit.rest.pulls.create({
        owner,
        repo: repositoryName,
        title: pullRequestTitle,
        body: pullRequestBody,
        head: branchName,
        base: baseBranchName,
      });
      return { url: pullRequest.html_url, number: pullRequest.number };
    } catch (error) {
      if (error.status === 422) {
        throw new Error(
          `Hey there! Looks like your code hasn't changed since the last build. We skipped creating a new pull request to keep things tidy.`
        );
      }
    }
    return null;
  }

  async getBranch({
    owner,
    repositoryName,
    branchName,
  }: GetBranchArgs): Promise<Branch | null> {
    try {
      const { data: ref } = await this.octokit.rest.git.getRef({
        owner,
        repo: repositoryName,
        ref: `heads/${branchName}`,
      });
      this.logger.info(
        `Got branch ${owner}/${repositoryName}/${branchName} with url ${ref.url}`
      );

      return { sha: ref.object.sha, name: branchName };
    } catch (error) {
      return null;
    }
  }

  async createBranch({
    owner,
    repositoryName,
    branchName,
    pointingSha,
    baseBranchName,
  }: CreateBranchArgs): Promise<Branch> {
    let baseSha = pointingSha;
    if (!baseSha) {
      const refs = await this.octokit.rest.git.getRef({
        owner,
        repo: repositoryName,
        ref: `heads/${baseBranchName}`,
      });
      baseSha = refs.data.object.sha;
    }
    const { data: branch } = await this.octokit.rest.git.createRef({
      owner,
      repo: repositoryName,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });
    return { name: branchName, sha: branch.object.sha };
  }

  async getFirstCommitOnBranch({
    branchName,
    owner,
    repositoryName,
  }: GetBranchArgs): Promise<Commit | null> {
    const firstCommit: TData = await this.octokit.graphql(
      `query ($owner: String!, $repo: String!, $branchName: String!) {
      repository(name: $repo, owner: $owner) {
        ref(qualifiedName: $branchName) {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  oid
                  url
                }
                totalCount
                pageInfo {
                  endCursor
                }
              }
            }
          }
        }
      }
    }`,
      {
        owner,
        repo: repositoryName,
        branchName,
      }
    );
    const { repository } = firstCommit;
    if (repository === null) {
      return null;
    }
    const { ref } = repository;
    if (ref === null) {
      return null;
    }
    const {
      target: {
        history: { nodes: firstCommitNodes, pageInfo, totalCount },
      },
    } = ref;

    if (totalCount <= 1) {
      return { sha: firstCommitNodes[0].oid };
    }

    const cursorPrefix = pageInfo.endCursor.split(" ")[0];
    const nextCursor = `${cursorPrefix} ${totalCount - 2}`;

    const lastCommitData: TData = await this.octokit.graphql(
      `query ($owner: String!, $repo: String!, $branchName: String!, $nextCursor: String!) {
        repository(name: $repo, owner: $owner) {
          ref(qualifiedName: $branchName) {
            target {
              ... on Commit {
                history(first: 1, after: $nextCursor) {
                  nodes {
                    oid
                    url
                  }
                  totalCount
                  pageInfo {
                    endCursor
                  }
                }
              }
            }
          }
        }
      }`,
      { owner, repo: repositoryName, branchName, nextCursor }
    );
    const { repository: lastCommitDataRepository } = lastCommitData;
    if (lastCommitDataRepository === null) {
      return null;
    }

    const { ref: lastCommitDataRef } = lastCommitDataRepository;
    if (lastCommitDataRef === null) {
      return null;
    }
    const {
      target: {
        history: { nodes: lastCommitNodes },
      },
    } = lastCommitDataRef;
    return { sha: lastCommitNodes[0].oid };
  }

  private convertFilesToGitHubFiles(
    files: UpdateFile[]
  ): Required<Changes["files"]> {
    return files.reduce((acc, file) => {
      if (file.skipIfExists) {
        // do not create the file if it already exist
        const gitHubUpdateFn: UpdateFunction = ({ exists }) => {
          if (exists) {
            return null;
          }
          return file.content;
        };
        acc[file.path] = gitHubUpdateFn;
      } else {
        acc[file.path] = file.content;
      }
      return acc;
    }, {} as Omit<Required<Changes["files"]>, "undefined">);
  }

  async createPullRequestComment(
    args: CreatePullRequestCommentArgs
  ): Promise<void> {
    const { data, where } = args;
    const { issueNumber, owner, repositoryName } = where;
    const { body } = data;
    await this.octokit.rest.issues.createComment({
      owner,
      body,
      repo: repositoryName,
      issue_number: issueNumber,
    });
    return;
  }

  private async getToken(): Promise<string> {
    const { data: installationTokenData } =
      await this.octokit.rest.apps.createInstallationAccessToken({
        installation_id: Number(this.installationId),
      });
    const { token } = installationTokenData;
    return token;
  }

  // methods that are exist in the GitProvider interface, but are not implemented for the GitHub provider

  async getOAuthTokens(authorizationCode: string): Promise<OAuthTokens> {
    throw NotImplementedError;
  }

  async getCurrentOAuthUser(accessToken: string): Promise<CurrentUser> {
    throw NotImplementedError;
  }

  getGitGroups(): Promise<PaginatedGitGroup> {
    throw NotImplementedError;
  }
}

type TData = {
  repository: {
    ref: {
      target: {
        history: {
          nodes: [
            {
              oid: string;
              url: string;
            }
          ];
          pageInfo: {
            endCursor: string;
          };
          totalCount: number;
        };
      };
    } | null;
  } | null;
};
