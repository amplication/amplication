import { ConfigService } from '@nestjs/config';
import { App } from 'octokit';
import {
  GITHUB_APP_APP_ID_VAR,
  GITHUB_APP_PRIVATE_KEY_VAR
} from './github.service';
import { ConverterUtil } from '../utils/ConverterUtil';
import {GitProvider} from "./git-provider.interface";
import {GitFactory} from "./git-provider-factory.interface";
import {GithubProvider} from "./githubProvider";

export class GithubFactory implements GitFactory {
  private app: App;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get(GITHUB_APP_APP_ID_VAR);
    const privateKey = this.configService
      .get(GITHUB_APP_PRIVATE_KEY_VAR)
      .replace(/\\n/g, '\n');

    this.app = new App({
      appId: appId,
      privateKey: privateKey
    });
  }

  public async getClient(
    installationId: string,
    owner: string,
    repo: string
  ): Promise<GitProvider> {
    const installationIdNumber = ConverterUtil.convertToNumber(installationId);
    const octokit = await this.app.getInstallationOctokit(installationIdNumber);
    return new GithubProvider(octokit, owner, repo);
  }
}
