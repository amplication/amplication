import { registerEnumType } from "@nestjs/graphql";

export enum EnumSubscriptionPlan {
  Free = "Free",
  Pro = "Pro",
  Enterprise = "Enterprise",
  PreviewBreakTheMonolith = "PreviewBreakTheMonolith",
  Essential = "Essential",
}
registerEnumType(EnumSubscriptionPlan, {
  name: "EnumSubscriptionPlan",
});
