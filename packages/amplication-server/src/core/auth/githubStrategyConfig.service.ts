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
  async getOptions(): Promise<StrategyOptions> {
    const GITHUB_CLIENT_ID_SECRET_NAME = this.configService.get(
      'GITHUB_CLIENT_ID_SECRET_NAME'
    );
    const GITHUB_SECRET_SECRET_NAME = this.configService.get(
      'GITHUB_SECRET_SECRET_NAME'
    );
    const clientID = await getSecret(
      this.googleSecretManagerService,
      GITHUB_CLIENT_ID_SECRET_NAME
    );
    const clientSecret = await getSecret(
      this.googleSecretManagerService,
      GITHUB_SECRET_SECRET_NAME
    );
    const callbackURL = this.configService.get('GITHUB_CALLBACK_URL');
    return {
      clientID,
      clientSecret,
      callbackURL
    };
  }
}
