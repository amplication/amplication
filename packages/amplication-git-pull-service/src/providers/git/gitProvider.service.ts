import { Injectable } from "@nestjs/common";
import { IGitProvider } from "../../contracts/gitProvider.interface";
import { App } from "octokit";
import { convertToNumber } from "../../utils/convertToNumber";
import { ConfigService } from "@nestjs/config";

const GITHUB_APP_APP_ID_VAR = "GITHUB_APP_APP_ID";
const GITHUB_APP_PRIVATE_KEY_VAR = "GITHUB_APP_PRIVATE_KEY";
/*
 * Octokit integration
 * */
@Injectable()
export class GitProviderService implements IGitProvider {
  private app: App;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get(GITHUB_APP_APP_ID_VAR);
    const privateKey = this.configService
      .get(GITHUB_APP_PRIVATE_KEY_VAR)
      .replace(/\\n/g, "\n");

    this.app = new App({
      appId,
      privateKey,
    });
  }

  async createInstallationAccessToken(installationId: string): Promise<string> {
    const installationIdNumber = convertToNumber(installationId);
    const octokit = await this.app.getInstallationOctokit(installationIdNumber);
    const { data } = await octokit.request(
      "POST /app/installations/{installation_id}/access_tokens",
      {
        installation_id: installationIdNumber,
        repositories: [],
      }
    );
    return data.token;
  }
}
