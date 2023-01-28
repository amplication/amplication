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
  PullRequest,
  GitProviderArgs,
  Repository,
  Pagination,
  CreateRepository,
} from "../types";
import { ConverterUtil } from "../utils/convert-to-number";
import {
  AMPLICATION_IGNORED_FOLDER,
  UNSUPPORTED_GIT_ORGANIZATION_TYPE,
} from "./git.constants";
import { AccumulativePullRequest } from "./github/AccumulativePullRequest";
import { BasicPullRequest } from "./github/BasicPullRequest";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { join } from "lodash";

const GITHUB_FILE_TYPE = "file";
export const GITHUB_CLIENT_SECRET_VAR = "GITHUB_CLIENT_SECRET";
export const GITHUB_APP_APP_ID_VAR = "GITHUB_APP_APP_ID";
export const GITHUB_APP_PRIVATE_KEY_VAR = "GITHUB_APP_PRIVATE_KEY";
export const GITHUB_APP_INSTALLATION_URL_VAR = "GITHUB_APP_INSTALLATION_URL";
export const UNEXPECTED_FILE_TYPE_OR_ENCODING = `Unexpected file type or encoding received`;
type DirectoryItem = components["schemas"]["content-directory"][number];

export class GithubService {
  private app: App;
  private gitInstallationUrl: string;

  constructor(private readonly gitProviderArgs: GitProviderArgs) {
    this.gitInstallationUrl = process.env.GITHUB_APP_INSTALLATION_URL;

    const appId = process.env.GITHUB_APP_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
    privateKey.replace(/\\n/g, "\n");

    this.app = new App({
      appId: appId,
      privateKey: privateKey,
    });
  }

  private async getInstallationAuthToken(
    installationId: string
  ): Promise<string> {
    const appId = process.env.GITHUB_APP_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
    privateKey.replace(/\\n/g, "\n");
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

  async getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return this.gitInstallationUrl.replace("{state}", amplicationWorkspaceId);
  }

  async getRepository(repository: Repository): Promise<RemoteGitRepository> {
    const { owner, repositoryName } = repository;
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

  async getRepositories(pagination: Pagination): Promise<RemoteGitRepos> {
    const { limit, page } = pagination;
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
    createRepository: CreateRepository
  ): Promise<RemoteGitRepository> {
    const { gitOrganization, owner, repositoryName, isPrivateRepository } =
      createRepository;

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

  async getGitRemoteOrganization(): Promise<RemoteGitOrganization> {
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

  async prepareFilesForPullRequest(
    owner,
    repositoryName,
    gitResourceMeta,
    pullRequestModule
  ): Promise<Required<Changes["files"]>> {
    const amplicationIgnoreManger = new AmplicationIgnoreManger();
    await amplicationIgnoreManger.init(async (fileName) => {
      try {
        const file = await this.getFile({
          owner,
          repositoryUrl: repositoryName,
          path: fileName,
          baseBranch: undefined, // take the default branch
        });
        const { content, htmlUrl, name } = file;
        console.log(`Got ${name} file ${htmlUrl}`);
        return content;
      } catch (error) {
        console.log("Repository does not have a .amplicationignore file");
        return "";
      }
    });

    //do not override files in 'server/src/[entity]/[entity].[controller/resolver/service/module].ts'
    //do not override server/scripts/customSeed.ts
    const doNotOverride = [
      new RegExp(
        `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.controller.ts$`
      ),
      new RegExp(
        `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.resolver.ts$`
      ),
      new RegExp(
        `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.service.ts$`
      ),
      new RegExp(
        `^${gitResourceMeta.serverPath || "server"}/src/[^/]+/.+.module.ts$`
      ),
      new RegExp(
        `^${gitResourceMeta.serverPath || "server"}/scripts/customSeed.ts$`
      ),
    ];

    const authFolder = "server/src/auth/";

    const files: Required<Changes["files"]> = Object.fromEntries(
      pullRequestModule.map((module) => {
        // ignored file
        if (amplicationIgnoreManger.isIgnored(module.path)) {
          return [join(AMPLICATION_IGNORED_FOLDER, module.path), module.code];
        }
        // Deleted file
        if (module.code === null) {
          return [module.path, module.code];
        }
        // Regex ignored file
        if (
          !module.path.startsWith(authFolder) &&
          doNotOverride.some((rx) => rx.test(module.path))
        ) {
          return [
            module.path,
            ({ exists }) => {
              // do not create the file if it already exist
              if (exists) return null;

              return module.code;
            },
          ];
        }
        // Regular file
        return [module.path, module.code];
      })
    );
    return files;
  }

  async createPullRequest(pullRequest: PullRequest): Promise<string> {
    const {
      pullRequestMode,
      owner,
      repositoryName,
      pullRequestModule,
      commit,
      pullRequestTitle,
      pullRequestBody,
      head,
      gitResourceMeta,
    } = pullRequest;

    const myOctokit = Octokit.plugin(createPullRequest);
    const token = await this.getInstallationAuthToken(
      this.gitProviderArgs.installationId
    );
    const octokit = new myOctokit({
      auth: token,
    });
    const files = await this.prepareFilesForPullRequest(
      owner,
      repositoryName,
      gitResourceMeta,
      pullRequestModule
    );

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
