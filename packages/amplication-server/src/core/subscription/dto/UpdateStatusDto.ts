import { SubscriptionStatus } from "@stigg/node-server-sdk";
import { BillingPlan } from "../../billing/billing.types";

export interface UpdateStatusDto {
  type: string;
  entityId: string;
  id: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  cancellationDate: string;
  trialEndDate: string;
  customer: Customer;
  plan: Plan;
  packageEntitlements: PackageEntitlement[];
  addons: Addon[];
  metadata: Metadata;
  experimentInfo: ExperimentInfo;
}

export interface Customer {
  entityId: string;
  id: string;
  name: string;
  email: string;
  billingId: string;
  crmId: string;
  metadata: Metadata;
  experimentInfo: ExperimentInfo;
}

export interface Metadata {
  userId: string;
}

export interface ExperimentInfo {
  id: string;
  name: string;
  groupName: string;
  groupType: string;
}

export interface Plan {
  id: BillingPlan;
  name: string;
  description: string;
}

export interface PackageEntitlement {
  feature: Feature;
  hasUnlimitedUsage: boolean;
  usageLimit: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  featureType: string;
  unit: string;
  units: string;
  status: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  quantity: number;
}
