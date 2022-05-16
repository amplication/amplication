import { InputType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto/WhereUniqueInput';
import { EnumSubscriptionStatusFilter } from './EnumSubscriptionStatusFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class FindSubscriptionsInput {
  workspace!: WhereUniqueInput;

  @Field(() => EnumSubscriptionStatusFilter, {
    nullable: true,
    description: undefined
  })
  status?: EnumSubscriptionStatusFilter | null;
}
