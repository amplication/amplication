import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class DeleteResourceRoleArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
