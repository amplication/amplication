import { CommitOrderByInput } from './CommitOrderByInput';
import { CommitWhereInput } from './CommitWhereInput';
import { CommitWhereUniqueInput } from './CommitWhereUniqueInput';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindManyCommitArgs {
  @Field(() => CommitWhereInput, { nullable: true })
  where?: CommitWhereInput | null | undefined;

  @Field(() => CommitOrderByInput, { nullable: true })
  orderBy?: CommitOrderByInput | null | undefined;

  @Field(() => CommitWhereUniqueInput, { nullable: true })
  cursor?: CommitWhereUniqueInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
