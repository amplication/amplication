import { ArgsType, Field } from '@nestjs/graphql';
import { CommitWhereUniqueInput } from './CommitWhereUniqueInput';

@ArgsType()
export class FindOneCommitArgs {
  @Field(() => CommitWhereUniqueInput, { nullable: false })
  where!: CommitWhereUniqueInput;
}
