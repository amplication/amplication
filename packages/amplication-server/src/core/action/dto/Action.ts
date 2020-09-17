import { ObjectType, Field } from '@nestjs/graphql';
import { ActionStep } from './ActionStep';

@ObjectType({
  isAbstract: true
})
export class Action {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => [ActionStep], {
    nullable: true
  })
  steps?: ActionStep[] | null | undefined;
}
