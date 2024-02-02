import { registerEnumType } from "@nestjs/graphql";

export enum EnumSubscriptionPlan {
  Free = "Free",
  Pro = "Pro",
  Enterprise = "Enterprise",
  PreviewBreakTheMonolith = "PreviewBreakTheMonolith",
}
registerEnumType(EnumSubscriptionPlan, {
  name: "EnumSubscriptionPlan",
});
