import { registerEnumType } from '@nestjs/graphql';

export enum EnumSubscriptionPlan {
  Pro = 'Pro',
  Business = 'Business',
  Enterprise = 'Enterprise'
}
registerEnumType(EnumSubscriptionPlan, {
  name: 'EnumSubscriptionPlan'
});
