import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SendGridOptionsFactory,
  SendGridModuleOptions,
} from "@ntegral/nestjs-sendgrid";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

export const SENDGRID_API_KEY_SECRET_VAR = "SENDGRID_API_KEY_SECRET";

export const MISSING_CLIENT_SECRET_ERROR = `Must provide ${SENDGRID_API_KEY_SECRET_VAR}`;

@Injectable()
export class SendgridConfigService implements SendGridOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  async createSendGridOptions(): Promise<SendGridModuleOptions> {
    return {
      apiKey: await this.getSecret(),
    };
  }

  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(SENDGRID_API_KEY_SECRET_VAR);
    if (!clientSecret) {
      this.logger.error(MISSING_CLIENT_SECRET_ERROR);
      return "";
    }
    return clientSecret;
  }
}
