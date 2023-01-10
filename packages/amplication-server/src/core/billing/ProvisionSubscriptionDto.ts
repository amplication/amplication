export class ProvisionSubscriptionDto {
  workspaceId: string;
  planId: string;
  billingPeriod: BillingPeriod;
  intentionType: "UPGRADE_PLAN" | "DOWNGRADE_PLAN";
  successUrl: string;
  cancelUrl: string;
}

export enum BillingPeriod {
  Annually = "ANNUALLY",
  Monthly = "MONTHLY",
}
