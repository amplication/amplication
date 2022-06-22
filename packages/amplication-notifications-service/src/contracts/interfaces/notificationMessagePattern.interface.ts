export interface NotificationMessagePattern {
  userId: string;
  payload: { [key: string]: string };
  template: string;
}
