import { ConfigService } from "@nestjs/config";
import { StrategyOptions } from "passport-github2";
import { Injectable } from "@nestjs/common";

export const GITHUB_CLIENT_ID_VAR = "GITHUB_CLIENT_ID";
export const GITHUB_CLIENT_SECRET_VAR = "GITHUB_CLIENT_SECRET";
export const GITHUB_REDIRECT_URI_VAR = "GITHUB_REDIRECT_URI";
export const GITHUB_SCOPE_VAR = "GITHUB_SCOPE";
export const MISSING_CLIENT_SECRET_ERROR = `Must provide ${GITHUB_CLIENT_SECRET_VAR}`;

@Injectable()
export class GitHubStrategyConfigService {
  constructor(private readonly configService: ConfigService) {}
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
      scope,
    };
  }
  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(GITHUB_CLIENT_SECRET_VAR);
    if (!clientSecret) {
      throw new Error(MISSING_CLIENT_SECRET_ERROR);
    }
    return clientSecret;
  }
}
