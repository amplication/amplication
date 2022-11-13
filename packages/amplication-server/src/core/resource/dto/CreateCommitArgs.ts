import { ArgsType, Field } from '@nestjs/graphql';
import { CommitCreateInput } from './CommitCreateInput';

@ArgsType()
export class CreateCommitArgs {
  @Field(() => CommitCreateInput, { nullable: false })
  data!: CommitCreateInput;
}
