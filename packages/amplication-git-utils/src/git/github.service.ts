import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createAppAuth } from "@octokit/auth-app";
import { components } from "@octokit/openapi-types";
import { App, Octokit } from "octokit";
import {
  EnumGitOrganizationType,
  EnumPullRequestMode,
  GitClient,
  GithubFile,
  Options,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "../types";
import { ConverterUtil } from "../utils/convert-to-number";
import { UNSUPPORTED_GIT_ORGANIZATION_TYPE } from "./git.constants";
import { AccumulativePullRequest } from "./github/AccumulativePullRequest";
import { BasicPullRequest } from "./github/BasicPullRequest";
import { createPullRequest } from "octokit-plugin-create-pull-request";

const GITHUB_FILE_TYPE = "file";
export const GITHUB_CLIENT_SECRET_VAR = "GITHUB_CLIENT_SECRET";
export const GITHUB_APP_APP_ID_VAR = "GITHUB_APP_APP_ID";
export const GITHUB_APP_PRIVATE_KEY_VAR = "GITHUB_APP_PRIVATE_KEY";
export const GITHUB_APP_INSTALLATION_URL_VAR = "GITHUB_APP_INSTALLATION_URL";
export const UNEXPECTED_FILE_TYPE_OR_ENCODING = `Unexpected file type or encoding received`;
type DirectoryItem = components["schemas"]["content-directory"][number];
@Injectable()
export class GithubService implements GitClient {
  private app: App;
  private gitInstallationUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.gitInstallationUrl = this.configService.get(
      GITHUB_APP_INSTALLATION_URL_VAR
    );

    const appId = this.configService.get(GITHUB_APP_APP_ID_VAR);
    const privateKey = this.configService
      .get(GITHUB_APP_PRIVATE_KEY_VAR)
      .replace(/\\n/g, "\n");

    this.app = new App({
      appId: appId,
      privateKey: privateKey,
    });
  }

  private async getInstallationAuthToken(
    installationId: string
  ): Promise<string> {
    const appId = this.configService.get(GITHUB_APP_APP_ID_VAR);
    const privateKey = this.configService
      .get(GITHUB_APP_PRIVATE_KEY_VAR)
      .replace(/\\n/g, "\n");
    const auth = createAppAuth({ appId, privateKey });
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

  async getGitInstallationUrl(options: Options): Promise<string> {
    const { amplicationWorkspaceId } = options;
    return this.gitInstallationUrl.replace("{state}", amplicationWorkspaceId);
  }

  async getRepository(options: Options): Promise<RemoteGitRepository> {
    const { installationId, owner, repositoryName } = options;
    const octokit = await this.getInstallationOctokit(installationId);
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

  async getRepositories(options: Options): Promise<RemoteGitRepos> {
    const { installationId, limit, page } = options;
    const octokit = await this.getInstallationOctokit(installationId);
    return await GithubService.getReposWithOctokitAndPagination(
      octokit,
      limit,
      page
    );
  }

  async createRepository(options: Options): Promise<RemoteGitRepository> {
    const {
      installationId,
      gitOrganization,
      owner,
      repositoryName,
      isPrivateRepository,
    } = options;

    if (gitOrganization.type === EnumGitOrganizationType.User) {
      throw new Error(UNSUPPORTED_GIT_ORGANIZATION_TYPE);
    }
    const octokit = await this.getInstallationOctokit(installationId);

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

  async deleteGitOrganization(options: Options): Promise<boolean> {
    const { installationId } = options;
    const octokit = await this.getInstallationOctokit(installationId);
    const deleteInstallationRes = await octokit.rest.apps.deleteInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: ConverterUtil.convertToNumber(installationId),
    });

    if (deleteInstallationRes.status != 204) {
      return false;
    }

    return true;
  }

  async getGitRemoteOrganization(
    options: Options
  ): Promise<RemoteGitOrganization> {
    const { installationId } = options;
    const octokit = await this.getInstallationOctokit(installationId);
    const gitRemoteOrganization = await octokit.rest.apps.getInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: ConverterUtil.convertToNumber(installationId),
    });
    const { data: gitRemoteOrgs } = gitRemoteOrganization;

    return {
      name: gitRemoteOrgs.account.login,
      type: EnumGitOrganizationType[gitRemoteOrganization.data.account.type],
    };
  }

  async getFile(options: Options): Promise<GithubFile> {
    const { installationId, owner, repositoryUrl, filePath, baseBranch } =
      options;
    const octokit = await this.getInstallationOctokit(installationId);
    const content = await octokit.rest.repos.getContent({
      owner,
      repo: repositoryUrl,
      path: filePath,
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

  async createPullRequest(options: Options): Promise<string> {
    const {
      pullRequestMode,
      owner,
      repositoryName,
      files,
      commitSha,
      commitMessage,
      pullRequestTitle,
      pullRequestBody,
      installationId,
      gitResourceMeta,
      head,
    } = options;
    const myOctokit = Octokit.plugin(createPullRequest);
    const token = await this.getInstallationAuthToken(installationId);
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
          commitMessage
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
          commitMessage
        );
    }
  }
}
