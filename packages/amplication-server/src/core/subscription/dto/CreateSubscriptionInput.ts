import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData
} from './index';

export class CreateSubscriptionInput {
  workspaceId: string;
  status: EnumSubscriptionStatus;
  plan: EnumSubscriptionPlan;
  subscriptionData: SubscriptionData;
}
