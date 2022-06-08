import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class FindOneResourceRoleArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => Number, { nullable: true })
  version: number;
}
