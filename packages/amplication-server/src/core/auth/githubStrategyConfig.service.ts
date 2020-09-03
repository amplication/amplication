import { ConfigService } from '@nestjs/config';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { StrategyOptions } from 'passport-github';

async function getSecret(
  googleSecretManagerService: GoogleSecretsManagerService,
  name: string
): Promise<string> {
  const [version] = await googleSecretManagerService.accessSecretVersion({
    name
  });
  return version.payload.data.toString();
}

export class GitHubStrategyConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService
  ) {}
  async getOptions(): Promise<StrategyOptions | null> {
    const clientID = this.configService.get('GITHUB_CLIENT_ID');
    if (!clientID) {
      return null;
    }
    const GITHUB_SECRET_SECRET_NAME = this.configService.get(
      'GITHUB_SECRET_SECRET_NAME'
    );
    const callbackURL = this.configService.get('GITHUB_REDIRECT_URI');
    const clientSecret = await getSecret(
      this.googleSecretManagerService,
      GITHUB_SECRET_SECRET_NAME
    );
    return {
      clientID,
      clientSecret,
      callbackURL
    };
  }
}
