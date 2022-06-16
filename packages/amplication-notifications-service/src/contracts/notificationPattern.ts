export class NotificationPattern {
  notificationName: string;
  userId: string;
  payload: { [key: string]: any };

  constructor(
    notificationName: string,
    userId: string,
    payload: { [key: string]: any }
  ) {
    this.notificationName = notificationName;
    this.userId = userId;
    this.payload = payload;
  }
}
