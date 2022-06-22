import { BadRequestException, Injectable } from '@nestjs/common';
import { Notification } from 'src/contracts/interfaces/notification.interface';
import { Novu } from '@novu/node';
import { ConfigService } from '@nestjs/config';
import { NotificationMessagePattern } from 'src/contracts/interfaces/notificationMessagePattern.interface';

const NOVU_API_KEY_ENV = 'NOVU_API_KEY';

@Injectable()
export class NotificationService implements Notification {
  novuApiKey: string;

  constructor(private configService: ConfigService) {
    this.novuApiKey = this.configService.get<string>(NOVU_API_KEY_ENV) || '';
  }

  async pushNotification(
    notificationData: NotificationMessagePattern
  ): Promise<void> {
    const { userId, payload, template } = notificationData;

    const novu = new Novu(this.novuApiKey);

    try {
      await novu.trigger(template, {
        to: {
          subscriberId: userId,
        },
        payload,
      });
    } catch (err) {
      throw new BadRequestException({
        message: `'Novu failed to send notification`,
        err,
      });
    }
  }
}
