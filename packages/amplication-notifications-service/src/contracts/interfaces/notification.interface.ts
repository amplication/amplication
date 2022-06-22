import { IMessagePattern } from './messagePattern.interface';

export const NOTIFICATION_TOKEN = 'NOTIFICATION_TOKEN';

export interface INotification {
  pushNotification: (notificationData: IMessagePattern) => Promise<void>;
}
