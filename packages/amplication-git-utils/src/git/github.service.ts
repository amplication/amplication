import { createAppAuth } from "@octokit/auth-app";
import { components } from "@octokit/openapi-types";
import { App, Octokit } from "octokit";
import {
  EnumGitOrganizationType,
  EnumPullRequestMode,
  GithubFile,
  File,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
  GitProviderArgs,
  GetRepositoryArgs,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
  CreatePullRequestArgs,
} from "../types";
import { ConverterUtil } from "../utils/convert-to-number";
import { UNSUPPORTED_GIT_ORGANIZATION_TYPE } from "./git.constants";
import { AccumulativePullRequest } from "./github/AccumulativePullRequest";
import { BasicPullRequest } from "./github/BasicPullRequest";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";

const GITHUB_FILE_TYPE = "file";

type DirectoryItem = components["schemas"]["content-directory"][number];

export class GithubService {
  private app: App;
  private appId: string;
  private privateKey: string;
  private gitInstallationUrl: string;

  constructor(private readonly gitProviderArgs: GitProviderArgs) {
    this.init();
  }

  init(): void {
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

  private static async getOrganizationReposWithOctokit(
    octokit: Octokit
  ): Promise<RemoteGitRepository[]> {
    const results = await octokit.request("GET /installation/repositories");
    return results.data.repositories.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions?.admin || false,
      defaultBranch: repo.default_branch,
    }));
  }

  private static async isRepoExistWithOctokit(
    octokit: Octokit,
    name: string
  ): Promise<boolean> {
    const repos = await GithubService.getOrganizationReposWithOctokit(octokit);
    return repos.map((repo) => repo.name).includes(name);
  }

  private static async getReposWithOctokitAndPagination(
    octokit: Octokit,
    limit = 10,
    page = 1
  ): Promise<RemoteGitRepos> {
    const results = await octokit.request(
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
    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );
    const response = await octokit.rest.repos.get({
      owner,
      repo: repositoryName,
    });
    const {
      name,
      html_url,
      private: isPrivate,
      default_branch: defaultBranch,
      full_name: fullName,
      permissions,
    } = response.data;
    const admin = permissions.admin || false;
    return {
      name,
      url: html_url,
      private: isPrivate,
      fullName,
      admin,
      defaultBranch,
    };
  }

  async getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    const { limit, page } = getRepositoriesArgs;
    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );
    return await GithubService.getReposWithOctokitAndPagination(
      octokit,
      limit,
      page
    );
  }

  async createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    const { gitOrganization, owner, repositoryName, isPrivateRepository } =
      createRepositoryArgs;

    if (gitOrganization.type === EnumGitOrganizationType.User) {
      throw new Error(UNSUPPORTED_GIT_ORGANIZATION_TYPE);
    }

    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );

    const exists: boolean = await GithubService.isRepoExistWithOctokit(
      octokit,
      repositoryName
    );
    if (exists) {
      return null;
    }

    const { data: repo } = await octokit.rest.repos.createInOrg({
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
    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );
    const deleteInstallationRes = await octokit.rest.apps.deleteInstallation({
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
    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );
    const gitRemoteOrganization = await octokit.rest.apps.getInstallation({
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

  async getFile(file: File): Promise<GithubFile> {
    const { owner, repositoryUrl, path, baseBranch } = file;
    const octokit = await this.getInstallationOctokit(
      this.gitProviderArgs.installationId
    );
    const content = await octokit.rest.repos.getContent({
      owner,
      repo: repositoryUrl,
      path,
      ref: baseBranch ? baseBranch : undefined,
    });

    if (!Array.isArray(content)) {
      const item = content.data as DirectoryItem;

      if (item.type === GITHUB_FILE_TYPE) {
        // Convert base64 results to UTF-8 string
        const buff = Buffer.from(item.content, "base64");

        const file: GithubFile = {
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

  async createPullRequest(
    createPullRequestArgs: CreatePullRequestArgs,
    files: Required<Changes["files"]>
  ): Promise<string> {
    const {
      pullRequestMode,
      owner,
      repositoryName,
      commit,
      pullRequestTitle,
      pullRequestBody,
      head,
    } = createPullRequestArgs;

    const myOctokit = Octokit.plugin(createPullRequest);
    const token = await this.getInstallationAuthToken(
      this.gitProviderArgs.installationId
    );
    const octokit = new myOctokit({
      auth: token,
    });

    switch (pullRequestMode) {
      case EnumPullRequestMode.Accumulative:
        return new AccumulativePullRequest(
          octokit,
          owner,
          repositoryName
        ).createPullRequest(
          pullRequestTitle,
          pullRequestBody,
          head,
          files,
          commit
        );
      default:
        return new BasicPullRequest(
          octokit,
          owner,
          repositoryName
        ).createPullRequest(
          pullRequestTitle,
          pullRequestBody,
          head,
          files,
          commit
        );
    }
  }
}
