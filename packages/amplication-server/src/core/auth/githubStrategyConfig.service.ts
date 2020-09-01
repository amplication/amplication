import { ConfigService } from '@nestjs/config';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { FactoryProvider } from '@nestjs/common';

async function getSecret(
  googleSecretManagerService: GoogleSecretsManagerService,
  name: string
): Promise<string> {
  const [version] = await googleSecretManagerService.accessSecretVersion({
    name
  });
  return version.payload.data.toString();
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GitHubStrategyConfig: FactoryProvider = {
  provide: 'GitHubStrategyConfig',
  useFactory: async (
    configService: ConfigService,
    googleSecretManagerService: GoogleSecretsManagerService
  ) => {
    const GITHUB_CLIENT_ID_SECRET_NAME = configService.get(
      'GITHUB_CLIENT_ID_SECRET_NAME'
    );
    const GITHUB_SECRET_SECRET_NAME = configService.get(
      'GITHUB_SECRET_SECRET_NAME'
    );
    const clientID = await getSecret(
      googleSecretManagerService,
      GITHUB_CLIENT_ID_SECRET_NAME
    );
    const clientSecret = await getSecret(
      googleSecretManagerService,
      GITHUB_SECRET_SECRET_NAME
    );
    const callbackURL = this.configService.get('GITHUB_CALLBACK_URL');
    return {
      clientID,
      clientSecret,
      callbackURL
    };
  },
  inject: [ConfigService, GoogleSecretsManagerService]
};
