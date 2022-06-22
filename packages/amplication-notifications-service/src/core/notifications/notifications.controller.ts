import { Controller, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  Notification,
  NOTIFICATION_TOKEN,
} from 'src/contracts/interfaces/notification.interface';
import { EnvironmentVariables } from 'src/services/environmentVariables';
import { NotificationMessagePattern } from 'src/contracts/interfaces/notificationMessagePattern.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

const KAFKA_TOPIC_NAME_KEY = 'KAFKA_TOPIC';

@Controller()
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATION_TOKEN) private notificationService: Notification,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @MessagePattern(EnvironmentVariables.getStrict(KAFKA_TOPIC_NAME_KEY))
  async onNotificationReceived(
    @Payload() message: { value: NotificationMessagePattern }
  ) {
    try {
      await this.notificationService.pushNotification(message.value);
    } catch (err: any) {
      this.logger.error({ message: err.message, err });
    }
  }
}
