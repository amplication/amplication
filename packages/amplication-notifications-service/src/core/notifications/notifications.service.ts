import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { INotification } from "src/contracts/interfaces/notification.interface";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Novu } from "@novu/node";
import { ConfigService } from "@nestjs/config";
import { NotificationPattern } from "src/contracts/notificationPattern";

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

  async pushNotification(notificationData: NotificationPattern): Promise<void> {
    const { userId, payload, notificationName } = notificationData;
    console.log(this.novuApiKey);

    const novu = new Novu(this.novuApiKey);

    try {
      await novu.trigger(notificationName, {
        to: {
          subscriberId: userId,
        },
        payload,
      });
    } catch (err) {
      this.logger.error(`Error form Novu ${err}`);
      throw new BadRequestException(
        `'Novu notification failed with the error: ${err}`
      );
    }
  }
}
