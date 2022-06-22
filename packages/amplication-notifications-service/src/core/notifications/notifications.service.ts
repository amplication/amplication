import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { INotification } from 'src/contracts/interfaces/notification.interface';
import { Novu } from '@novu/node';
import { ConfigService } from '@nestjs/config';
import { IMessagePattern } from 'src/contracts/interfaces/messagePattern.interface';

const NOVU_API_KEY_ENV = 'NOVU_API_KEY';

@Injectable()
export class NotificationService implements INotification {
  novuApiKey: string;

  constructor(private configService: ConfigService) {
    this.novuApiKey = this.configService.get<string>(NOVU_API_KEY_ENV) || '';
  }

  async pushNotification(notificationData: IMessagePattern): Promise<void> {
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
