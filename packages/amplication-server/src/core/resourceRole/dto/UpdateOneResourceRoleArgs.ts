import { ArgsType, Field } from '@nestjs/graphql';
import { ResourceRoleUpdateInput } from './ResourceRoleUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneResourceRoleArgs {
  @Field(() => ResourceRoleUpdateInput, { nullable: false })
  data!: ResourceRoleUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
