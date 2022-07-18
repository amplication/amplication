import { Field, ObjectType } from '@nestjs/graphql';
import { Workspace } from 'src/models/Workspace'; // eslint-disable-line import/no-cycle
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData
} from '.';

@ObjectType({
  isAbstract: true
})
export class Subscription {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => Workspace, {
    nullable: true
  })
  workspace?: Workspace;

  @Field(() => String, {
    nullable: false
  })
  workspaceId: string;

  @Field(() => EnumSubscriptionPlan, {
    nullable: false
  })
  subscriptionPlan: keyof typeof EnumSubscriptionPlan;

  @Field(() => EnumSubscriptionStatus, {
    nullable: false
  })
  status: keyof typeof EnumSubscriptionStatus;

  @Field(() => Date, {
    nullable: true
  })
  cancellationEffectiveDate?: Date | null;

  @Field(() => String, {
    nullable: true
  })
  cancelUrl?: string;

  @Field(() => String, {
    nullable: true
  })
  updateUrl?: string;

  @Field(() => Date, {
    nullable: true
  })
  nextBillDate?: Date;

  @Field(() => Number, {
    nullable: true
  })
  price?: number;

  subscriptionData!: SubscriptionData;
}
