import { ArgsType, Field, Int } from '@nestjs/graphql';
import { AppOrderByInput } from '../inputs';
import { AppWhereInput } from '../inputs';
import { WhereUniqueInput } from '../inputs';

@ArgsType()
export class FindManyAppArgs {
  @Field(_type => AppWhereInput, { nullable: true })
  where?: AppWhereInput | null;

  @Field(_type => AppOrderByInput, { nullable: true })
  orderBy?: AppOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => WhereUniqueInput, { nullable: true })
  after?: WhereUniqueInput | null;

  @Field(_type => WhereUniqueInput, { nullable: true })
  before?: WhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
