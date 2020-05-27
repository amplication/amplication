import { ArgsType, Field, Int } from '@nestjs/graphql';
import { AppOrderByInput } from './';
import { AppWhereInput } from './';
import { WhereUniqueInput } from '../../../dto/inputs';

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
