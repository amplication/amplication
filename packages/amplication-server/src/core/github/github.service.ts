import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//@octokit/openapi-types constantly fails with linting error "Unable to resolve path to module '@octokit/openapi-types'."
// We currently ignore it and should look deeper into the root cause
// eslint-disable-next-line import/no-unresolved
import { components } from '@octokit/openapi-types';
import { PrismaService } from 'nestjs-prisma';
import { App, Octokit } from 'octokit';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { AmplicationError } from 'src/errors/AmplicationError';
import { GitRepository } from 'src/models/GitRepository';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { REPO_NAME_TAKEN_ERROR_MESSAGE } from '../git/constants';
import { IGitClient } from '../git/contracts/IGitClient';
import { CreateRepoArgsType } from '../git/contracts/types/CreateRepoArgsType';
import { CreateGitOrganizationArgs } from '../git/dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryInput } from '../git/dto/inputs/CreateGitRepositoryInput';
import { GitRepo } from '../git/dto/objects/GitRepo';
import { GithubFile } from './dto/githubFile';
import { GithubTokenExtractor } from './utils/tokenExtractor/githubTokenExtractor';
import { createAppAuth } from '@octokit/auth-app';
import { GitOrganization } from 'src/models/GitOrganization';

const GITHUB_FILE_TYPE = 'file';

export const GITHUB_CLIENT_ID_VAR = 'GITHUB_CLIENT_ID';
export const GITHUB_CLIENT_SECRET_VAR = 'GITHUB_CLIENT_SECRET';
export const GITHUB_APP_CLIENT_SECRET_VAR = 'GITHUB_APP_CLIENT_SECRET';
export const GITHUB_APP_CLIENT_ID_VAR = 'GITHUB_APP_CLIENT_ID';
export const GITHUB_APP_APP_ID_VAR = 'GITHUB_APP_APP_ID';
export const GITHUB_APP_PRIVATE_KEY_VAR = 'GITHUB_APP_PRIVATE_KEY';
export const GITHUB_APP_INSTALLATION_URL_VAR = 'GITHUB_APP_INSTALLATION_URL';

export const GITHUB_SECRET_SECRET_NAME_VAR = 'GITHUB_SECRET_SECRET_NAME';
export const GITHUB_APP_AUTH_REDIRECT_URI_VAR = 'GITHUB_APP_AUTH_REDIRECT_URI';
export const GITHUB_APP_AUTH_SCOPE_VAR = 'GITHUB_APP_AUTH_SCOPE';
export const MISSING_CLIENT_SECRET_ERROR = `Must provide either ${GITHUB_CLIENT_SECRET_VAR} or ${GITHUB_SECRET_SECRET_NAME_VAR}`;
export const UNEXPECTED_FILE_TYPE_OR_ENCODING = `Unexpected file type or encoding received`;

type DirectoryItem = components['schemas']['content-directory'][number];

@Injectable()
export class GithubService implements IGitClient {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService,
    public readonly tokenExtractor: GithubTokenExtractor,
    private readonly prisma: PrismaService
  ) {}
  async getGitOrganizations(workspaceId: string): Promise<GitOrganization[]> {
    return await this.prisma.gitOrganization.findMany({
      where: {
        workspaceId: workspaceId
      }
    });
  }
  async deleteGitOrganization(gitOrganizationId: string): Promise<boolean> {
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );

    if (installationId == null) {
      throw new AmplicationError('INVALID_GITHUB_APP'); //todo: const parameter
    }
    const octokit = await this.getInstallationOctokit(installationId);
    const deleteInstallationRes = await octokit.rest.apps.deleteInstallation({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      installation_id: installationId
    });

    if (deleteInstallationRes.status != 204) {
      throw new AmplicationError('delete installationId {} failed'); //todo: remove to const param
    }

    return true;
  }

  async getGitInstallationUrl(workspaceId: string): Promise<string> {
    let gitInstallationUrl = this.configService.get(
      GITHUB_APP_INSTALLATION_URL_VAR //todo: remove to ctor
    );
    gitInstallationUrl = gitInstallationUrl.replace('{state}', workspaceId);
    return gitInstallationUrl;
  }

  async createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    const installationId = parseInt(args.data.installationId);
    const octokit = await this.getInstallationOctokit(installationId);
    const gitOrganizationName = await this.getOrganizationName(
      octokit,
      installationId
    );
    return await this.prisma.gitOrganization.create({
      data: {
        ...args.data,
        installationId: args.data.installationId,
        name: gitOrganizationName
      }
    });
  }

  async isRepoExistWithOctokit(
    octokit: Octokit,
    name: string
  ): Promise<boolean> {
    const repos = await this.getOrganizationReposWithOctokit(octokit);
    if (repos.map(repo => repo.name).includes(name)) {
      return true;
    }
    return false;
  }
  async isRepoExist(gitOrganizationId: string, name: string): Promise<boolean> {
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    const octokit = await this.getInstallationOctokit(installationId);
    return await this.isRepoExistWithOctokit(octokit, name);
  }

  private async getOrganizationName(
    octokit: Octokit,
    installationId: number
  ): Promise<string> {
    return (
      await octokit.rest.apps.getInstallation({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        installation_id: installationId
      })
    ).data.account.login;
  }

  private async getInstallationIdByGitOrganizationId(
    gitOrganizationId: string
  ): Promise<number | null> {
    return parseInt(
      (
        await this.prisma.gitOrganization.findFirst({
          where: {
            id: gitOrganizationId
          }
        })
      ).installationId
    );
  }

  async createRepo(args: CreateRepoArgsType): Promise<GitRepo> {
    const { input, gitOrganizationId } = args;
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    const octokit = await this.getInstallationOctokit(installationId);
    const gitOrganizationName = await this.getOrganizationName(
      octokit,
      installationId
    );

    if (await this.isRepoExistWithOctokit(octokit, input.name)) {
      throw new AmplicationError(REPO_NAME_TAKEN_ERROR_MESSAGE);
    }
    return await octokit.rest.repos
      .createInOrg({
        org: gitOrganizationName,
        name: input.name
      })
      .then(response => {
        const { data: repo } = response;
        //TODO add logger
        // console.log('Repository %s created', repo.full_name);
        return {
          name: repo.name,
          url: repo.html_url,
          private: repo.private,
          fullName: repo.full_name,
          admin: repo.permissions.admin
        };
      });
  }

  async getOrganizationReposWithOctokit(octokit: Octokit): Promise<GitRepo[]> {
    const results = await octokit.request('GET /installation/repositories');
    return results.data.repositories.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin
    }));
  }
  async getOrganizationRepos(organizationId: string): Promise<GitRepo[]> {
    const installationId = await this.getInstallationIdByGitOrganizationId(
      organizationId
    );
    const octokit = await this.getInstallationOctokit(installationId);
    return await this.getOrganizationReposWithOctokit(octokit);
  }

  private async getInstallationOctokit(
    //todo: remove to ctor
    installationId: number
  ): Promise<Octokit> {
    const app = new App({
      appId: this.configService.get(GITHUB_APP_APP_ID_VAR),
      privateKey: this.configService
        .get(GITHUB_APP_PRIVATE_KEY_VAR)
        .replace(/\\n/g, '\n')
    });
    return await app.getInstallationOctokit(installationId);
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
    const octokit = await this.getInstallationOctokit(parseInt(installationId));
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
    const auth = createAppAuth({
      appId: this.configService.get(GITHUB_APP_APP_ID_VAR),
      privateKey: this.configService
        .get(GITHUB_APP_PRIVATE_KEY_VAR)
        .replace(/\\n/g, '\n')
    });

    // Retrieve installation access token
    const installationAuthentication = await auth({
      type: 'installation',
      installationId: installationId
    });

    const myOctokit = Octokit.plugin(createPullRequest);

    const octokit = new myOctokit({
      auth: installationAuthentication.token
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

  async getGithubIdAndSecret(): Promise<[string, string]> {
    //todo: check if in use
    const clientID = this.configService.get(GITHUB_CLIENT_ID_VAR);
    const clientSecret = await this.getSecret();
    if (!clientID || !clientSecret)
      throw new Error(MISSING_CLIENT_SECRET_ERROR);
    return [clientID, clientSecret];
  }
  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(GITHUB_CLIENT_SECRET_VAR);
    if (clientSecret) {
      return clientSecret;
    }
    const secretName = this.configService.get(GITHUB_SECRET_SECRET_NAME_VAR);
    if (!secretName) {
      throw new Error(MISSING_CLIENT_SECRET_ERROR);
    }
    return this.getSecretFromManager(secretName);
  }
  private async getSecretFromManager(name: string): Promise<string> {
    const secretManager = this.googleSecretManagerService;
    const [version] = await secretManager.accessSecretVersion({ name });
    return version.payload.data.toString();
  }
}
