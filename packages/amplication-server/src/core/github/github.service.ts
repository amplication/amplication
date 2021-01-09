import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { GithubRepo } from './dto/githubRepo';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { OAuthApp } from '@octokit/oauth-app';

export const GCS_BUCKET_VAR = 'GCS_BUCKET';

export const GITHUB_CLIENT_ID_VAR = 'GITHUB_CLIENT_ID';
export const GITHUB_CLIENT_SECRET_VAR = 'GITHUB_CLIENT_SECRET';
export const GITHUB_SECRET_SECRET_NAME_VAR = 'GITHUB_SECRET_SECRET_NAME';
export const GITHUB_APP_AUTH_REDIRECT_URI_VAR = 'GITHUB_APP_AUTH_REDIRECT_URI';
export const GITHUB_APP_AUTH_SCOPE_VAR = 'GITHUB_APP_AUTH_SCOPE';
export const MISSING_CLIENT_SECRET_ERROR = `Must provide either ${GITHUB_CLIENT_SECRET_VAR} or ${GITHUB_SECRET_SECRET_NAME_VAR}`;

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService
  ) {}

  async getRepos(userName: string, token: string): Promise<GithubRepo[]> {
    const octokit = new Octokit({
      auth: token
    });

    console.time();

    const results = await octokit.repos.listForAuthenticatedUser({
      username: userName,
      type: 'all'
    });

    console.timeEnd();

    console.log(results);

    return results.data.map(repo => ({
      name: repo.name,
      url: repo.url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin
    }));
  }

  async createPullRequest(
    userName: string,
    repoName: string,
    modules: { path: string; code: string }[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    baseBranchName: string,
    token: string
  ): Promise<boolean> {
    const myOctokit = Octokit.plugin(createPullRequest);

    const TOKEN = token;
    const octokit = new myOctokit({
      auth: TOKEN
    });

    const files = Object.fromEntries(
      modules.map(module => [module.path, module.code])
    );

    //console.log(files);

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

    console.log(pr);
    return true;
  }

  async getOAuthAppAuthorizationUrl(appId: string) {
    const clientID = this.configService.get(GITHUB_CLIENT_ID_VAR);
    if (!clientID) {
      return null;
    }
    const clientSecret = await this.getSecret();

    const app = new OAuthApp({
      clientId: clientID,
      clientSecret: clientSecret
    });

    const redirectURL: string = this.configService
      .get(GITHUB_APP_AUTH_REDIRECT_URI_VAR)
      .replace('{appId}', appId);
    const scope = this.configService.get(GITHUB_APP_AUTH_SCOPE_VAR);

    const url = app.getAuthorizationUrl({
      redirectUrl: redirectURL,
      state:
        'state123' /**@todo: generate unique URL and save it for later check */,
      scopes: scope
    });

    return url;
  }

  async createOAuthAppAuthorizationToken(
    state: string,
    code: string
  ): Promise<string> {
    const clientID = this.configService.get(GITHUB_CLIENT_ID_VAR);
    if (!clientID) {
      return null;
    }
    const clientSecret = await this.getSecret();

    const app = new OAuthApp({
      clientId: clientID,
      clientSecret: clientSecret
    });

    const { token } = await app.createToken({
      state: state,
      code: code
    });

    return token;
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
