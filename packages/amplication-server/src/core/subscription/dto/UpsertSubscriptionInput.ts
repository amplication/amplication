import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "./index";

export class UpsertSubscriptionInput {
  workspaceId: string;
  status: EnumSubscriptionStatus;
  plan: EnumSubscriptionPlan;
}
