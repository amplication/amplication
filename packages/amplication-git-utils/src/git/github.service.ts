import { createAppAuth } from "@octokit/auth-app";
import { components } from "@octokit/openapi-types";
import { App, Octokit } from "octokit";
import {
  EnumGitOrganizationType,
  GitFile,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  GitProviderArgs,
  GetRepositoryArgs,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
  GitProvider,
  CreatePullRequestFromFilesArgs,
  Branch,
  CreateBranchIfNotExistsArgs,
  CreateCommitArgs,
  GetPullRequestForBranchArgs,
  CreatePullRequestForBranchArgs,
  GetFileArgs,
  UpdateFile,
} from "../types";
import { ConverterUtil } from "../utils/convert-to-number";
import { UNSUPPORTED_GIT_ORGANIZATION_TYPE } from "./git.constants";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import {
  Changes,
  TreeParameter,
  UpdateFunctionFile,
  File as OctokitFile,
} from "octokit-plugin-create-pull-request/dist-types/types";

const GITHUB_FILE_TYPE = "file";

type DirectoryItem = components["schemas"]["content-directory"][number];

export class GithubService implements GitProvider {
  private app: App;
  private appId: string;
  private privateKey: string;
  private gitInstallationUrl: string;
  private octokit: Octokit;

  constructor(private readonly gitProviderArgs: GitProviderArgs) {
    const {
      GITHUB_APP_INSTALLATION_URL,
      GITHUB_APP_APP_ID,
      GITHUB_APP_PRIVATE_KEY,
    } = process.env;
    this.gitInstallationUrl = GITHUB_APP_INSTALLATION_URL;
    this.appId = GITHUB_APP_APP_ID;
    this.privateKey = GITHUB_APP_PRIVATE_KEY;

    const privateKey = this.getFormattedPrivateKey(this.privateKey);

    this.app = new App({
      appId: this.appId,
      privateKey,
    });
  }

  async init(): Promise<void> {
    if (this.gitProviderArgs.installationId) {
      this.octokit = await this.getInstallationOctokit(
        this.gitProviderArgs.installationId
      );
    }
  }

  async getAuthByTemporaryCode(): Promise<string> {
    return Promise.resolve(
      `Not implemented for ${this.gitProviderArgs.provider} provider`
    );
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
    const {
      data: {
        permissions: { admin },
        url,
        private: isPrivate,
        name,
        full_name: fullName,
        default_branch: defaultBranch,
      },
    } = await this.octokit.rest.repos.get({
      owner,
      repo: repositoryName,
    });

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
  ): Promise<RemoteGitRepository> {
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

    return {
      name: gitRemoteOrgs.account.login,
      type: EnumGitOrganizationType[gitRemoteOrganization.data.account.type],
    };
  }

  async getFile(file: GetFileArgs): Promise<GitFile> {
    const { owner, repositoryName, path, baseBranchName } = file;

    const content = await this.octokit.rest.repos.getContent({
      owner,
      repo: repositoryName,
      path,
      ref: baseBranchName ? baseBranchName : undefined,
    });

    if (!Array.isArray(content)) {
      const item = content.data as DirectoryItem;

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
    return pr.data.html_url;
  }

  async createBranchIfNotExists({
    owner,
    repositoryName,
    branchName,
  }: CreateBranchIfNotExistsArgs): Promise<Branch> {
    const { sha } = await this.getFirstDefaultBranchCommit(
      owner,
      repositoryName
    );
    const isBranchExist = await this.isBranchExist(
      owner,
      repositoryName,
      branchName
    );
    if (!isBranchExist) {
      return this.createBranch(owner, repositoryName, branchName, sha);
    }
    return this.getBranch(owner, repositoryName, branchName);
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

    console.log(`Got last commit with url ${lastCommit.html_url}`);

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

    console.info(`Created tree for for ${owner}/${repositoryName}`);

    const { data: commit } = await this.octokit.rest.git.createCommit({
      message: commitMessage,
      owner,
      repo: repositoryName,
      tree: lastTreeSha,
      parents: [lastCommit.sha],
    });

    console.info(`Created commit for ${owner}/${repositoryName}`);

    await this.octokit.rest.git.updateRef({
      owner,
      repo: repositoryName,
      sha: commit.sha,
      ref: `heads/${branchName}`,
    });

    console.info(`Updated branch ${branchName} for ${owner}/${repositoryName}`);
  }

  async getPullRequestForBranch({
    owner,
    repositoryName,
    branchName,
  }: GetPullRequestForBranchArgs): Promise<
    { url: string; number: number } | undefined
  > {
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

    return existingPullRequest;
  }

  async createPullRequestForBranch({
    owner,
    repositoryName,
    branchName,
    pullRequestTitle,
    pullRequestBody,
    defaultBranchName,
  }: CreatePullRequestForBranchArgs): Promise<string> {
    const { data: pullRequest } = await this.octokit.rest.pulls.create({
      owner,
      repo: repositoryName,
      title: pullRequestTitle,
      body: pullRequestBody,
      head: branchName,
      base: defaultBranchName,
    });
    return pullRequest.html_url;
  }

  private async isBranchExist(
    owner: string,
    repositoryName: string,
    branch: string
  ): Promise<boolean> {
    try {
      const refs = await this.getBranch(owner, repositoryName, branch);
      return Boolean(refs);
    } catch (error) {
      return false;
    }
  }

  private async getBranch(
    owner: string,
    repositoryName: string,
    branchName: string
  ): Promise<Branch> {
    const { data: ref } = await this.octokit.rest.git.getRef({
      owner,
      repo: repositoryName,
      ref: `heads/${branchName}`,
    });

    console.log(
      `Got branch ${owner}/${repositoryName}/${branchName} with url ${ref.url}`
    );

    return { sha: ref.object.sha, name: branchName };
  }

  private async createBranch(
    owner: string,
    repositoryName: string,
    newBranchName: string,
    sha?: string
  ): Promise<Branch> {
    let baseSha = sha;
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
      ref: `refs/heads/${newBranchName}`,
      sha: baseSha,
    });
    return { name: newBranchName, sha: branch.object.sha };
  }

  private async getFirstDefaultBranchCommit(
    owner: string,
    repositoryName: string
  ): Promise<{ sha: string }> {
    const { defaultBranch } = await this.getRepository({
      owner,
      repositoryName,
    });
    const firstCommit: TData = await this.octokit.graphql(
      `query ($owner: String!, $repo: String!, $defaultBranch: String!) {
      repository(name: $repo, owner: $owner) {
        ref(qualifiedName: $defaultBranch) {
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
        defaultBranch,
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
      `query ($owner: String!, $repo: String!, $defaultBranch: String!, $nextCursor: String!) {
        repository(name: $repo, owner: $owner) {
          ref(qualifiedName: $defaultBranch) {
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
      { owner, repo: repositoryName, defaultBranch, nextCursor }
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
    const branch = await this.getBranch(owner, repositoryName, branchName);

    console.log(
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
    }, {} as Required<Changes["files"]>);
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
