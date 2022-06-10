import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IInAppNotification } from '../../contracts/inAppNotification.interface';
import { Novu } from '@novu/node';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class InAppNotificationService implements IInAppNotification {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async pushNotification(
    notificationName: string,
    userId: string,
    payload: { [key: string]: any }
  ): Promise<void> {
    const novu = new Novu(process.env.NOVU_API_KEY);
    try {
      await novu.trigger(notificationName, {
        to: {
          subscriberId: userId
        },
        payload
      });
      this.logger.info(
        `in-app notification: ${notificationName} was triggered with the payload: ${{
          ...payload
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
