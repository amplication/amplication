import { ConfigService } from '@nestjs/config';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { StrategyOptions } from 'passport-github2';
import { Injectable } from '@nestjs/common';

export const GITHUB_CLIENT_ID_VAR = 'GITHUB_CLIENT_ID';
export const GITHUB_CLIENT_SECRET_VAR = 'GITHUB_CLIENT_SECRET';
export const GITHUB_SECRET_SECRET_NAME_VAR = 'GITHUB_SECRET_SECRET_NAME';
export const GITHUB_REDIRECT_URI_VAR = 'GITHUB_REDIRECT_URI';
export const GITHUB_SCOPE_VAR = 'GITHUB_SCOPE';
export const MISSING_CLIENT_SECRET_ERROR = `Must provide either ${GITHUB_CLIENT_SECRET_VAR} or ${GITHUB_SECRET_SECRET_NAME_VAR}`;

@Injectable()
export class GitHubStrategyConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService
  ) {}
  async getOptions(): Promise<StrategyOptions | null> {
    const clientID = this.configService.get(GITHUB_CLIENT_ID_VAR);
    if (!clientID) {
      return null;
    }
    const clientSecret = await this.getSecret();
    const callbackURL = this.configService.get(GITHUB_REDIRECT_URI_VAR);
    const scope = this.configService.get(GITHUB_SCOPE_VAR);
    return {
      clientID,
      clientSecret,
      callbackURL,
      scope
    };
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
