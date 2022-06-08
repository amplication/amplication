import { ArgsType, Field } from '@nestjs/graphql';
import { ResourceUpdateInput } from './ResourceUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneResourceArgs {
  @Field(() => ResourceUpdateInput, { nullable: false })
  data!: ResourceUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
