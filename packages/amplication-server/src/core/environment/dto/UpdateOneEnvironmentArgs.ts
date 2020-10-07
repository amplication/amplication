import { ArgsType, Field } from '@nestjs/graphql';
import { EnvironmentUpdateInput } from './EnvironmentUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneEnvironmentArgs {
  @Field(() => EnvironmentUpdateInput, { nullable: false })
  data!: EnvironmentUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
