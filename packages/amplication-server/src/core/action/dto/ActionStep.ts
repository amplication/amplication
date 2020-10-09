import { ObjectType, Field } from '@nestjs/graphql';
import { EnumActionStepStatus } from './EnumActionStepStatus';
import { ActionLog } from './ActionLog';

@ObjectType({
  isAbstract: true
})
export class ActionStep {
  @Field(() => String, {})
  id!: string;

  @Field(() => Date, {})
  createdAt!: Date;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  message!: string;

  @Field(() => EnumActionStepStatus)
  status!: keyof typeof EnumActionStepStatus;

  @Field(() => Date, {
    nullable: true
  })
  completedAt?: Date;

  @Field(() => [ActionLog], {
    nullable: true
  })
  logs?: ActionLog[] | null | undefined;
}
