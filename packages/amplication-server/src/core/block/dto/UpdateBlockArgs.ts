import { ArgsType, Field } from '@nestjs/graphql';
import { BlockUpdateInput } from './BlockUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateBlockArgs {
  @Field(() => BlockUpdateInput, { nullable: false })
  data!: BlockUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
