import { ArgsType, Field, Int } from '@nestjs/graphql';
import { CommitOrderByInput } from './CommitOrderByInput';
import { CommitWhereInput } from './CommitWhereInput';

@ArgsType()
export class FindManyCommitsArgs {
  @Field(() => CommitWhereInput, { nullable: true })
  where?: CommitWhereInput | null;

  @Field(() => CommitOrderByInput, { nullable: true })
  orderBy?: CommitOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
