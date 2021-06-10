import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto/WhereUniqueInput';

@ArgsType()
export class SetCurrentWorkspaceArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  data!: WhereUniqueInput;
}
