export enum EnumPaddleSubscriptionStatus {
  Active = 'Active',
  Trailing = 'Trailing',
  PastDue = 'PastDue',
  Paused = 'Paused',
  Deleted = 'Deleted'
}

export class SubscriptionData {
  paddleEmail!: string;

  paddleUserId!: string;

  paddleSubscriptionId: string;

  paddleSubscriptionPlanId: string;

  paddleSubscriptionStatus: EnumPaddleSubscriptionStatus;

  paddleNextBillDate: Date;

  paddleCancellationEffectiveDate?: Date | null;

  paddlePausedFrom?: Date | null;

  paddleUpdateUrl: string;

  paddleCancelUrl: string;

  paddleUnitPrice: number;
}
