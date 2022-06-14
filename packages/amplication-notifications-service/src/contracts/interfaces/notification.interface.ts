import { KafkaMessagePayload } from "../kafkaMessagePayload";

export const NOTIFICATION_TOKEN = "IN_APP_NOTIFICATION_TOKEN";

export interface INotification {
  pushNotification: (notificationData: KafkaMessagePayload) => Promise<void>;
}
