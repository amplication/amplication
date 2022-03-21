import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAppAuth } from '@octokit/auth-app';
//@octokit/openapi-types constantly fails with linting error "Unable to resolve path to module '@octokit/openapi-types'."
// We currently ignore it and should look deeper into the root cause
// eslint-disable-next-line import/no-unresolved
import { components } from '@octokit/openapi-types';
import { App, Octokit } from 'octokit';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { AmplicationError } from 'src/errors/AmplicationError';
import { IGitClient } from '../git/contracts/IGitClient';
import { RemoteGitRepository } from '../git/dto/objects/RemoteGitRepository';
import { EnumGitOrganizationType } from '../git/dto/enums/EnumGitOrganizationType';
import { RemoteGitOrganization } from '../git/dto/objects/RemoteGitOrganization';
import { GithubFile } from '@amplication/git-service/src/Dto/entities/GithubFile';

const GITHUB_FILE_TYPE = 'file';
export const GITHUB_CLIENT_SECRET_VAR = 'GITHUB_CLIENT_SECRET';
export const GITHUB_APP_APP_ID_VAR = 'GITHUB_APP_APP_ID';
export const GITHUB_APP_PRIVATE_KEY_VAR = 'GITHUB_APP_PRIVATE_KEY';
export const GITHUB_APP_INSTALLATION_URL_VAR = 'GITHUB_APP_INSTALLATION_URL';
export const UNEXPECTED_FILE_TYPE_OR_ENCODING = `Unexpected file type or encoding received`;

type DirectoryItem = components['schemas']['content-directory'][number];

@Injectable()
export class GithubService implements IGitClient {
  private app: App;
  private gitInstallationUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.gitInstallationUrl = this.configService.get(
      GITHUB_APP_INSTALLATION_URL_VAR
    );

    const appId = this.configService.get(GITHUB_APP_APP_ID_VAR);
    const privateKey = this.configService
      .get(GITHUB_APP_PRIVATE_KEY_VAR)
      .replace(/\\n/g, '\n');

    this.app = new App({
      appId: appId,
      privateKey: privateKey
    });
  }

  async getGitRemoteOrganization(
    installationId: string
  ): Promise<RemoteGitOrganization> {
    const octokit = await this.getInstallationOctokit(installationId);
    const gitRemoteOrganization = await octokit.rest.apps.getInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: GithubService.convertToNumber(installationId)
    });
    const { data: gitRemoteOrgs } = gitRemoteOrganization;

    return {
      name: gitRemoteOrgs.account.login,
      type: EnumGitOrganizationType[gitRemoteOrganization.data.account.type]
    };
  }

  async deleteGitOrganization(installationId: string): Promise<boolean> {
    const octokit = await this.getInstallationOctokit(installationId);
    const deleteInstallationRes = await octokit.rest.apps.deleteInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: GithubService.convertToNumber(installationId)
    });

    if (deleteInstallationRes.status != 204) {
      throw new AmplicationError('delete installationId {} failed');
    }

    return true;
  }

  async getGitInstallationUrl(workspaceId: string): Promise<string> {
    return this.gitInstallationUrl.replace('{state}', workspaceId);
  }

  private static async isRepoExistWithOctokit(
    octokit: Octokit,
    name: string
  ): Promise<boolean> {
    const repos = await GithubService.getOrganizationReposWithOctokit(octokit);
    return repos.map(repo => repo.name).includes(name);
  }

  async isRepoExist(installationId: string, name: string): Promise<boolean> {
    const octokit = await this.getInstallationOctokit(installationId);
    return await GithubService.isRepoExistWithOctokit(octokit, name);
  }

  async createUserRepository(
    installationId: string,
    owner: string,
    name: string
  ): Promise<RemoteGitRepository> {
    throw new AmplicationError('UNSUPPORTED_GIT_ORGANIZATION_TYPE');
  }

  async createOrganizationRepository(
    installationId: string,
    owner: string,
    name: string
  ): Promise<RemoteGitRepository> {
    const octokit = await this.getInstallationOctokit(installationId);

    const exists: boolean = await GithubService.isRepoExistWithOctokit(
      octokit,
      name
    );
    if (exists) {
      throw new AmplicationError('REPO_NAME_TAKEN_ERROR_MESSAGE');
    }

    const { data: repo } = await octokit.rest.repos.createInOrg({
      name: name,
      org: owner,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      auto_init: true
    });

    return {
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin
    };
  }

  private static async getOrganizationReposWithOctokit(
    octokit: Octokit
  ): Promise<RemoteGitRepository[]> {
    const results = await octokit.request('GET /installation/repositories');
    return results.data.repositories.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin
    }));
  }

  async getOrganizationRepos(
    installationId: string
  ): Promise<RemoteGitRepository[]> {
    const octokit = await this.getInstallationOctokit(installationId);
    return await GithubService.getOrganizationReposWithOctokit(octokit);
  }

  private async getInstallationOctokit(
    installationId: string
  ): Promise<Octokit> {
    const installationIdNumber = GithubService.convertToNumber(installationId);
    return await this.app.getInstallationOctokit(installationIdNumber);
  }

  /**
   * Gets a file from GitHub - Currently only returns the content of a single file and only if it is base64 encoded . Otherwise, returns null
   * @param userName
   * @param repoName
   * @param path
   * @param baseBranchName
   * @param installationId
   */
  async getFile(
    userName: string,
    repoName: string,
    path: string,
    baseBranchName: string,
    installationId: string
  ): Promise<GithubFile> {
    const octokit = await this.getInstallationOctokit(installationId);
    const content = await octokit.rest.repos.getContent({
      owner: userName,
      repo: repoName,
      path,
      ref: baseBranchName ? baseBranchName : undefined
    });

    if (!Array.isArray(content)) {
      const item = content.data as DirectoryItem;

      if (item.type === GITHUB_FILE_TYPE) {
        // Convert base64 results to UTF-8 string
        const buff = Buffer.from(item.content, 'base64');

        const file: GithubFile = {
          content: buff.toString('utf-8'),
          htmlUrl: item.html_url,
          name: item.name,
          path: item.path
        };
        return file;
      }
    }

    throw new Error(UNEXPECTED_FILE_TYPE_OR_ENCODING);
  }

  async createPullRequest(
    userName: string,
    repoName: string,
    modules: { path: string; code: string }[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    baseBranchName: string,
    installationId: string
  ): Promise<string> {
    const myOctokit = Octokit.plugin(createPullRequest);

    const token = await this.getInstallationAuthToken(installationId);
    const octokit = new myOctokit({
      auth: token
    });

    //do not override files in 'server/src/[entity]/[entity].[controller/resolver/service/module].ts'
    //do not override server/scripts/customSeed.ts
    const doNotOverride = [
      /^server\/src\/[^\/]+\/.+\.controller.ts$/,
      /^server\/src\/[^\/]+\/.+\.resolver.ts$/,
      /^server\/src\/[^\/]+\/.+\.service.ts$/,
      /^server\/src\/[^\/]+\/.+\.module.ts$/,
      /^server\/scripts\/customSeed.ts$/
    ];

    const authFolder = 'server/src/auth';

    const files = Object.fromEntries(
      modules.map(module => {
        if (
          !module.path.startsWith(authFolder) &&
          doNotOverride.some(rx => rx.test(module.path))
        ) {
          return [
            module.path,
            ({ exists }) => {
              // do not create the file if it already exist
              if (exists) return null;

              return module.code;
            }
          ];
        }

        return [module.path, module.code];
      })
    );

    //todo: delete files that are no longer part of the app

    // Returns a normal Octokit PR response
    // See https://octokit.github.io/rest.js/#octokit-routes-pulls-create

    const pr = await octokit.createPullRequest({
      owner: userName,
      repo: repoName,
      title: commitMessage,
      body: commitDescription,
      base: baseBranchName /* optional: defaults to default branch */,
      head: commitName,
      changes: [
        {
          /* optional: if `files` is not passed, an empty commit is created instead */
          files: files,
          // {
          //   'path/to/file1.txt': 'Content for file1',
          //   'path/to/file2.png': {
          //     content: '_base64_encoded_content_',
          //     encoding: 'base64'
          //   },
          //   // deletes file if it exists,
          //   'path/to/file3.txt': null,
          //   // updates file based on current content
          //   'path/to/file4.txt': ({ exists, encoding, content }) => {
          //     // do not create the file if it does not exist
          //     if (!exists) return null;

          //     return Buffer.from(content, encoding)
          //       .toString('utf-8')
          //       .toUpperCase();
          //   }
          // },
          commit: commitName
        }
      ]
    });
    return pr.data.html_url;
  }

  private async getInstallationAuthToken(
    installationId: string
  ): Promise<string> {
    const auth = createAppAuth({
      appId: this.configService.get(GITHUB_APP_APP_ID_VAR),
      privateKey: this.configService
        .get(GITHUB_APP_PRIVATE_KEY_VAR)
        .replace(/\\n/g, '\n')
    });
    // Retrieve installation access token
    return (
      await auth({
        type: 'installation',
        installationId: installationId
      })
    ).token;
  }

  private static convertToNumber(value: string): number {
    const result = parseInt(value);
    if (isNaN(result)) {
      throw new AmplicationError(
        'GitHub App installation identifier is invalid'
      );
    }
    return result;
  }
}
