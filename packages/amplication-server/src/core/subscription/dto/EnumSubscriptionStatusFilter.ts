import { Field, InputType } from '@nestjs/graphql';
import { EnumSubscriptionStatus } from './EnumSubscriptionStatus';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumSubscriptionStatusFilter {
  @Field(() => EnumSubscriptionStatus, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumSubscriptionStatus | null;

  @Field(() => EnumSubscriptionStatus, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumSubscriptionStatus | null;

  @Field(() => [EnumSubscriptionStatus], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumSubscriptionStatus | null>;

  @Field(() => [EnumSubscriptionStatus], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof EnumSubscriptionStatus | null>;
}
