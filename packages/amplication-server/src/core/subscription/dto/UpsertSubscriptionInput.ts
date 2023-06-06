import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData,
} from "./index";

export class UpsertSubscriptionInput {
  workspaceId: string;
  status: EnumSubscriptionStatus;
  plan: EnumSubscriptionPlan;
  subscriptionData: SubscriptionData;
}
