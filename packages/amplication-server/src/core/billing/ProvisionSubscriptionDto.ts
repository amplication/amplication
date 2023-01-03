export class ProvisionSubscriptionDto {
  workspaceId: string;
  planId: string;
  billingPeriod: BillingPeriod;
  successUrl: string;
  cancelUrl: string;
}

export enum BillingPeriod {
  Annually = "ANNUALLY",
  Monthly = "MONTHLY",
}
