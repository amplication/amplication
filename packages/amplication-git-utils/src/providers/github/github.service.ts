import { ILogger } from "@amplication/util/logging";
import { createAppAuth } from "@octokit/auth-app";
import { components } from "@octokit/openapi-types";
import { App, Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import {
  Changes,
  File as OctokitFile,
  TreeParameter,
  UpdateFunctionFile,
} from "octokit-plugin-create-pull-request/dist-types/types";
import { PaginationLimit } from "../../errors/PaginationLimit";
import { GitProvider } from "../../git-provider.interface";
import {
  Branch,
  CloneUrlArgs,
  Commit,
  CreateBranchArgs,
  CreateCommitArgs,
  CreatePullRequestCommentArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  EnumGitOrganizationType,
  EnumGitProvider,
  GetBranchArgs,
  GetFileArgs,
  GetPullRequestForBranchArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  GitProviderConstructorArgs,
  GitUser,
  PullRequest,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  UpdateFile,
  OAuth2FlowResponse,
} from "../../types";
import { ConverterUtil } from "../../utils/convert-to-number";
import { NotImplementedError } from "../../utils/custom-error";
import { UNSUPPORTED_GIT_ORGANIZATION_TYPE } from "../git.constants";

const GITHUB_FILE_TYPE = "file";

type DirectoryItem = components["schemas"]["content-directory"][number];

export class GithubService implements GitProvider {
  private app: App;
  private appId: string;
  private privateKey: string;
  private gitInstallationUrl: string;
  private octokit: Octokit;
  public readonly name = EnumGitProvider.Github;
  public readonly domain = "github.com";
  constructor(
    private readonly gitProviderArgs: GitProviderConstructorArgs,
    private readonly logger: ILogger
  ) {
    const {
      GITHUB_APP_INSTALLATION_URL,
      GITHUB_APP_APP_ID,
      GITHUB_APP_PRIVATE_KEY,
    } = process.env;
    if (!GITHUB_APP_INSTALLATION_URL) {
      throw new Error("GITHUB_APP_INSTALLATION_URL is not defined");
    }
    this.gitInstallationUrl = GITHUB_APP_INSTALLATION_URL;
    if (!GITHUB_APP_APP_ID) {
      throw new Error("GITHUB_APP_APP_ID is not defined");
    }
    this.appId = GITHUB_APP_APP_ID;
    if (!GITHUB_APP_PRIVATE_KEY) {
      throw new Error("GITHUB_APP_PRIVATE_KEY is not defined");
    }
    this.privateKey = GITHUB_APP_PRIVATE_KEY;

    const privateKey = this.getFormattedPrivateKey(this.privateKey);
    this.app = new App({
      appId: this.appId,
      privateKey,
    });
  }

  getCloneUrl({ owner, repositoryName, token }: CloneUrlArgs) {
    return `https://x-access-token:${token}@${this.domain}/${owner}/${repositoryName}.git`;
  }

  async getCurrentUserCommitList(args: GetBranchArgs): Promise<Commit[]> {
    const { branchName, owner, repositoryName } = args;
    const currentUserData = await this.getCurrentUser();

    let moreCommitsPagination = true;
    let commitsList: Commit[] = [];
    let cursor: string | undefined = undefined;

    do {
      const { commits, hasNextPage, endCursor } =
        await this.paginatedCommitsList({
          botData: currentUserData,
          branchName,
          owner,
          repositoryName,
          cursor,
          paginationLimit: 100,
        });
      moreCommitsPagination = hasNextPage;
      commitsList = commitsList.concat(commits); // The list is in ascending order ( newest commits are first )
      cursor = endCursor;
    } while (moreCommitsPagination);

    return commitsList;
  }

  private async paginatedCommitsList(
    args: GetBranchArgs & {
      cursor: string | undefined;
      botData: GitUser;
      paginationLimit: number;
    }
  ): Promise<{ commits: Commit[]; hasNextPage: boolean; endCursor: string }> {
    const {
      branchName,
      owner,
      repositoryName,
      cursor,
      botData,
      paginationLimit,
    } = args;
    if (paginationLimit > 100 || paginationLimit < 1) {
      throw new PaginationLimit(paginationLimit);
    }

    const data: {
      repository: {
        ref: {
          target: {
            history: {
              nodes: {
                oid: string;
              }[];
              pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
              };
            };
          };
        };
      };
    } = await this.octokit.graphql(
      `query ($owner: String!, $repo: String!, $branch: String!, $author: ID!, $paginationLimit: Int!) {
        repository(name: $repo, owner: $owner) {
          ref(qualifiedName: $branch) {
            target {
              ... on Commit {
                history(author:{id: $author},first: $paginationLimit ${
                  cursor ? `,after:"${cursor}"` : ""
                }) {
                  nodes {
                    oid
                  }
                  pageInfo {
                    hasNextPage
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
        branch: branchName,
        author: botData.id,
        paginationLimit,
      }
    );
    const {
      repository: {
        ref: {
          target: {
            history: {
              nodes,
              pageInfo: { endCursor, hasNextPage },
            },
          },
        },
      },
    } = data;
    return {
      commits: nodes.map(({ oid }) => ({
        sha: oid,
      })),
      hasNextPage,
      endCursor,
    };
  }

  async getCurrentUser(): Promise<GitUser> {
    const data: { viewer: { id: string; login: string } } = await this.octokit
      .graphql(`{
      viewer{
        id
        login
      }
    }`);
    const {
      viewer: { id, login },
    } = data;
    return {
      login,
      id,
    };
  }

  async init(): Promise<void> {
    if (this.gitProviderArgs.installationId) {
      this.octokit = await this.getInstallationOctokit(
        this.gitProviderArgs.installationId
      );
    }
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
    limit = 10,
    page = 1
  ): Promise<RemoteGitRepos> {
    const results = await this.octokit.request(
      `GET /installation/repositories?per_page=${limit}&page=${page}`
    );
    const repos = results.data.repositories.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin,
    }));

    return {
      totalRepos: results.data.total_count,
      repos: repos,
      pageSize: limit,
      currentPage: page,
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
      name,
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
    const { limit, page } = getRepositoriesArgs;
    return await this.getRepositoriesWithPagination(limit, page);
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository | null> {
    const { gitOrganization, owner, repositoryName, isPrivateRepository } =
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
      private: !isPrivateRepository,
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
        installation_id: ConverterUtil.convertToNumber(
          this.gitProviderArgs.installationId
        ),
      });

    if (deleteInstallationRes.status != 204) {
      return false;
    }

    return true;
  }

  async getOrganization(): Promise<RemoteGitOrganization> {
    const gitRemoteOrganization = await this.octokit.rest.apps.getInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: ConverterUtil.convertToNumber(
        this.gitProviderArgs.installationId
      ),
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
    };
  }

  async getFile(file: GetFileArgs): Promise<GitFile | null> {
    const { owner, repositoryName, path, baseBranchName } = file;

    const content = await this.octokit.rest.repos.getContent({
      owner,
      repo: repositoryName,
      path,
      ref: baseBranchName ? baseBranchName : undefined,
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
          htmlUrl: item.html_url,
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
    const token = await this.getInstallationAuthToken(
      this.gitProviderArgs.installationId
    );
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

  async createCommit({
    owner,
    repositoryName,
    commitMessage,
    branchName,
    files,
  }: CreateCommitArgs): Promise<void> {
    const gitHubFils = this.convertFilesToGitHubFiles(files);
    const lastCommit = await this.getLastCommit(
      owner,
      repositoryName,
      branchName
    );

    this.logger.info(`Got last commit with url ${lastCommit.html_url}`);

    if (!lastCommit) {
      throw new Error("No last commit found");
    }

    const lastTreeSha = await this.createTree(
      owner,
      repositoryName,
      lastCommit.sha,
      lastCommit.commit.tree.sha,
      gitHubFils
    );

    if (lastTreeSha === null) {
      throw new Error("Missing tree sha");
    }

    this.logger.info(`Created tree for for ${owner}/${repositoryName}`);

    const { data: commit } = await this.octokit.rest.git.createCommit({
      message: commitMessage,
      owner,
      repo: repositoryName,
      tree: lastTreeSha,
      parents: [lastCommit.sha],
    });

    this.logger.info(`Created commit for ${owner}/${repositoryName}`);

    await this.octokit.rest.git.updateRef({
      owner,
      repo: repositoryName,
      sha: commit.sha,
      ref: `heads/${branchName}`,
    });

    this.logger.info(
      `Updated branch ${branchName} for ${owner}/${repositoryName}`
    );
  }

  async getPullRequestForBranch({
    owner,
    repositoryName,
    branchName,
  }: GetPullRequestForBranchArgs): Promise<PullRequest | null> {
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

  async createPullRequestForBranch({
    owner,
    repositoryName,
    branchName,
    pullRequestTitle,
    pullRequestBody,
    defaultBranchName,
  }: CreatePullRequestForBranchArgs): Promise<PullRequest> {
    const { data: pullRequest } = await this.octokit.rest.pulls.create({
      owner,
      repo: repositoryName,
      title: pullRequestTitle,
      body: pullRequestBody,
      head: branchName,
      base: defaultBranchName,
    });
    return { url: pullRequest.html_url, number: pullRequest.number };
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
  }: CreateBranchArgs): Promise<Branch> {
    let baseSha = pointingSha;
    if (!baseSha) {
      const repository = await this.getRepository({ owner, repositoryName });
      const { defaultBranch } = repository;

      const refs = await this.octokit.rest.git.getRef({
        owner,
        repo: repositoryName,
        ref: `heads/${defaultBranch}`,
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
  }: GetBranchArgs): Promise<{ sha: string }> {
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
    const {
      repository: {
        ref: {
          target: {
            history: { nodes: firstCommitNodes, pageInfo, totalCount },
          },
        },
      },
    } = firstCommit;

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
    const {
      repository: {
        ref: {
          target: {
            history: { nodes: lastCommitNodes },
          },
        },
      },
    } = lastCommitData;
    return { sha: lastCommitNodes[0].oid };
  }

  private async getLastCommit(
    owner: string,
    repositoryName: string,
    branchName: string
  ) {
    const branch = await this.getBranch({ owner, repositoryName, branchName });

    if (!branch) {
      throw new Error("Branch not found");
    }

    this.logger.info(
      `Got branch ${owner}/${repositoryName}/${branch.name} with sha ${branch.sha}`
    );

    const [lastCommit] = (
      await this.octokit.rest.repos.listCommits({
        owner,
        repo: repositoryName,
        sha: branch.sha,
      })
    ).data;

    return lastCommit;
  }

  private async createTree(
    owner: string,
    repositoryName: string,
    latestCommitSha: string,
    latestCommitTreeSha: string,
    changes: Required<Changes["files"]>
  ): Promise<string | null> {
    if (changes === undefined) {
      throw new Error("Missing changes");
    }
    const tree = (
      await Promise.all(
        Object.keys(changes).map(async (path) => {
          const value = changes[path];

          if (value === null) {
            // Deleting a non-existent file from a tree leads to an "GitRPC::BadObjectState" error,
            // so we only attempt to delete the file if it exists.
            try {
              // https://developer.github.com/v3/repos/contents/#get-contents
              await this.octokit.request(
                "HEAD /repos/{owner}/{repo}/contents/:path",
                {
                  owner,
                  repo: repositoryName,
                  ref: latestCommitSha,
                  path,
                }
              );

              return {
                path,
                mode: "100644",
                sha: null,
              };
            } catch (error) {
              return;
            }
          }

          // When passed a function, retrieve the content of the file, pass it
          // to the function, then return the result
          if (typeof value === "function") {
            let result;

            try {
              const { data: file } = await this.octokit.request(
                "GET /repos/{owner}/{repo}/contents/:path",
                {
                  owner,
                  repo: repositoryName,
                  ref: latestCommitSha,
                  path,
                }
              );

              result = await value(
                Object.assign(file, { exists: true }) as UpdateFunctionFile
              );
            } catch (error) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // istanbul ignore if
              if (error.status !== 404) throw error;

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              result = await value({ exists: false });
            }

            if (result === null || typeof result === "undefined") return;
            return this.valueToTreeObject(owner, repositoryName, path, result);
          }

          return this.valueToTreeObject(owner, repositoryName, path, value);
        })
      )
    ).filter(Boolean) as TreeParameter;

    if (tree.length === 0) {
      return null;
    }

    // https://developer.github.com/v3/git/trees/#create-a-tree
    const {
      data: { sha: newTreeSha },
    } = await this.octokit.request("POST /repos/{owner}/{repo}/git/trees", {
      owner,
      repo: repositoryName,
      base_tree: latestCommitTreeSha,
      tree,
    });

    return newTreeSha;
  }

  private async valueToTreeObject(
    owner: string,
    repositoryName: string,
    path: string,
    value: string | OctokitFile
  ) {
    let mode = "100644";
    if (value !== null && typeof value !== "string") {
      mode = value.mode || mode;
    }

    // Text files can be changed through the .content key
    if (typeof value === "string") {
      return {
        path,
        mode: mode,
        content: value,
      };
    }

    // Binary files need to be created first using the git blob API,
    // then changed by referencing in the .sha key
    const { data } = await this.octokit.request(
      "POST /repos/{owner}/{repo}/git/blobs",
      {
        owner,
        repo: repositoryName,
        ...value,
      }
    );
    const blobSha = data.sha;

    return {
      path,
      mode: mode,
      sha: blobSha,
    };
  }

  private convertFilesToGitHubFiles(
    files: UpdateFile[]
  ): Required<Changes["files"]> {
    return files.reduce((acc, file) => {
      acc[file.path] = file.content;
      return acc;
    }, {} as Omit<Required<Changes["files"]>, "undefined">);
  }

  async commentOnPullRequest(
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

  async getToken(): Promise<string> {
    const { data: installationTokenData } =
      await this.octokit.rest.apps.createInstallationAccessToken({
        installation_id: Number(this.gitProviderArgs.installationId),
      });
    const { token } = installationTokenData;
    return token;
  }

  // methods that are exist in the GitProvider interface, but are not implemented for the GitHub provider

  async completeOAuth2Flow(
    authorizationCode: string
  ): Promise<OAuth2FlowResponse> {
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
    };
  };
};
