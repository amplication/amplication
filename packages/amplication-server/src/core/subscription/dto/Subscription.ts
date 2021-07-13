import { Field, ObjectType } from '@nestjs/graphql';
import { Workspace } from 'src/models/Workspace'; // eslint-disable-line import/no-cycle
import { SubscriptionData } from '.';

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

  subscriptionData!: SubscriptionData;
}
