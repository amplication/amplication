import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData
} from './index';

export class UpdateSubscriptionInput {
  workspaceId: string;
  status: EnumSubscriptionStatus;
  plan: EnumSubscriptionPlan;
  subscriptionData: SubscriptionData;
}
