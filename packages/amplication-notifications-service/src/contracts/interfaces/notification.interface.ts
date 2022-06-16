import { NotificationPattern } from '../notificationPattern';

export const NOTIFICATION_TOKEN = 'NOTIFICATION_TOKEN';

export interface INotification {
  pushNotification: (notificationData: NotificationPattern) => Promise<void>;
}
