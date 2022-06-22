import { NotificationMessagePattern } from './notificationMessagePattern.interface';

export const NOTIFICATION_TOKEN = 'NOTIFICATION_TOKEN';

export interface Notification {
  pushNotification: (
    notificationData: NotificationMessagePattern
  ) => Promise<void>;
}
