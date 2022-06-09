export const IN_APP_NOTIFICATION_TOKEN = 'IN_APP_NOTIFICATION_TOKEN';

export interface IInAppNotification {
  pushNotification: (
    notificationName: string,
    userId: string,
    payload: { [key: string]: any }
  ) => Promise<void>;
}
