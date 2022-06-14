import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { INotification } from "src/contracts/interfaces/notification.interface";
import { KafkaMessagePayload } from "src/contracts/kafkaMessagePayload";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Novu } from "@novu/node";
import { ConfigService } from "@nestjs/config";

const NOVU_API_KEY_ENV = "NOVU_API_KEY";

@Injectable()
export class NotificationService implements INotification {
  novuApiKey: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService
  ) {
    this.novuApiKey = this.configService.get<string>(NOVU_API_KEY_ENV) || "";
  }

  async pushNotification(notificationData: KafkaMessagePayload): Promise<void> {
    const { userId, payload, template } = notificationData;
    const novu = new Novu(this.novuApiKey);

    try {
      await novu.trigger(template, {
        to: {
          subscriberId: userId,
        },
        payload,
      });
      this.logger.log(
        `in-app notification: ${template} was triggered with the payload: ${{
          ...payload,
        }}`
      );
    } catch (err) {
      this.logger.error(`Error form Novu ${err}`);
      throw new BadRequestException(
        `'Novu notification failed with the error: ${err}`
      );
    }
  }
}
