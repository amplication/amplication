import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  INotification,
  NOTIFICATION_TOKEN,
} from "src/contracts/interfaces/notification.interface";
import { NotificationPattern } from "src/contracts/notificationPattern";
import { KafkaMessagePayload } from "src/contracts/kafkaMessagePayload";
import { EnvironmentVariables } from "src/services/environmentVariables";

const KAFKA_TOPIC_NAME_KEY = "KAFKA_TOPIC";

@Controller()
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATION_TOKEN) private notificationService: INotification
  ) {}

  @MessagePattern(EnvironmentVariables.getStrict(KAFKA_TOPIC_NAME_KEY))
  async onNotificationReceived(
    @Payload() message: { value: KafkaMessagePayload }
  ) {
    const { value } = message;
    const notification: NotificationPattern = {
      userId: value.userId,
      notificationName: value.template,
      payload: value.payload
    }
    return this.notificationService.pushNotification(notification);
  }
}
