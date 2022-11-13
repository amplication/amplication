import { registerEnumType } from '@nestjs/graphql';

export enum EnumSubscriptionStatus {
  Active = 'Active',
  Trailing = 'Trailing',
  PastDue = 'PastDue',
  Paused = 'Paused',
  Deleted = 'Deleted'
}
registerEnumType(EnumSubscriptionStatus, {
  name: 'EnumSubscriptionStatus'
});
