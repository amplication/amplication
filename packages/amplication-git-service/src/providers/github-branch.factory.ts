import { ConfigService } from '@nestjs/config';
import { App } from 'octokit';
import {
  GITHUB_APP_APP_ID_VAR,
  GITHUB_APP_PRIVATE_KEY_VAR
} from './github.service';
import {
  GithubBranchProvider,
  GitProviderBranch
} from './github-branch.provider';
import { ConverterUtil } from '../utils/ConverterUtil';

export class GithubBranchFactory {
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
    repo: string,
    branch: string
  ): Promise<GitProviderBranch> {
    const installationIdNumber = ConverterUtil.convertToNumber(installationId);
    const octokit = await this.app.getInstallationOctokit(installationIdNumber);
    return new GithubBranchProvider(octokit, owner, repo, branch);
  }
}
