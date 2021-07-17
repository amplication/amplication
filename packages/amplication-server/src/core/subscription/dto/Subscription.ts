import { Field, ObjectType } from '@nestjs/graphql';
import { Workspace } from 'src/models/Workspace'; // eslint-disable-line import/no-cycle
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData
} from '.';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Subscription {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  @Field(() => Workspace, {
    nullable: true,
    description: undefined
  })
  workspace?: Workspace;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  workspaceId: string;

  @Field(() => EnumSubscriptionPlan, {
    nullable: false,
    description: undefined
  })
  subscriptionPlan: keyof typeof EnumSubscriptionPlan;

  @Field(() => EnumSubscriptionStatus, {
    nullable: false,
    description: undefined
  })
  status: keyof typeof EnumSubscriptionStatus;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  cancellationEffectiveDate?: Date | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  cancelUrl?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  updateUrl?: string;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  nextBillDate?: Date;

  @Field(() => Number, {
    nullable: true,
    description: undefined
  })
  price?: number;

  subscriptionData!: SubscriptionData;
}
