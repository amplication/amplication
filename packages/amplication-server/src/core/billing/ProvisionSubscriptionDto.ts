export class ProvisionSubscriptionDto {
  workspaceId: string;
  planId: string;
  billingPeriod: BillingPeriod;
  isLowerThanCurrentPlan: boolean;
  successUrl: string;
  cancelUrl: string;
}

export enum BillingPeriod {
  Annually = "ANNUALLY",
  Monthly = "MONTHLY",
}
