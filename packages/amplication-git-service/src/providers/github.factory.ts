import { App } from 'octokit';
import { ConverterUtil } from '../utils/ConverterUtil';
import { GitProvider } from './git-provider.interface';
import { GitFactory } from './git-provider-factory.interface';
import { Injectable } from '@nestjs/common';
import { GithubConfig } from '../utils/github-config.dto';
import { GithubProvider } from './GithubProvider';

@Injectable()
export class GithubFactory implements GitFactory {
  private app: App;

  constructor(private readonly config: GithubConfig) {
    this.app = new App({
      appId: config.appId,
      privateKey: config.pem
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
