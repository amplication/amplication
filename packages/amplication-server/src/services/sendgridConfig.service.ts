import { Injectable } from '@nestjs/common';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import { ConfigService } from '@nestjs/config';
import {
  SendGridOptionsFactory,
  SendGridModuleOptions
} from '@ntegral/nestjs-sendgrid';

export const SENDGRID_API_KEY_SECRET_VAR = 'SENDGRID_API_KEY_SECRET';
export const SENDGRID_API_KEY_SECRET_NAME_VAR = 'SENDGRID_API_KEY_SECRET_NAME';

export const MISSING_CLIENT_SECRET_ERROR = `Must provide either ${SENDGRID_API_KEY_SECRET_VAR} or ${SENDGRID_API_KEY_SECRET_NAME_VAR}`;

@Injectable()
export class SendgridConfigService implements SendGridOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService
  ) {}

  async createSendGridOptions(): Promise<SendGridModuleOptions> {
    return {
      apiKey: await this.getSecret()
    };
  }

  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(SENDGRID_API_KEY_SECRET_VAR);
    if (clientSecret) {
      return clientSecret;
    }
    const secretName = this.configService.get(SENDGRID_API_KEY_SECRET_NAME_VAR);
    if (!secretName) {
      console.error(MISSING_CLIENT_SECRET_ERROR);
      return '';
    }
    return this.getSecretFromManager(secretName);
  }
  private async getSecretFromManager(name: string): Promise<string> {
    const secretManager = this.googleSecretManagerService;
    const [version] = await secretManager.accessSecretVersion({ name });
    return version.payload.data.toString();
  }
}
