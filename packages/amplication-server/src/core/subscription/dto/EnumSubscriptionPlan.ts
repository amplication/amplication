import { registerEnumType } from "@nestjs/graphql";

export enum EnumSubscriptionPlan {
  Free = "Free",
  Pro = "Pro",
  Enterprise = "Enterprise",
}
registerEnumType(EnumSubscriptionPlan, {
  name: "EnumSubscriptionPlan",
});
