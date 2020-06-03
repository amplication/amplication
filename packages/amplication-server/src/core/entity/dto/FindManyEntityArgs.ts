import { ArgsType, Field, Int } from '@nestjs/graphql';
import { EntityOrderByInput, EntityWhereInput } from './';

@ArgsType()
export class FindManyEntityArgs {
  @Field(_type => EntityWhereInput, { nullable: true })
  where?: EntityWhereInput | null;

  @Field(_type => EntityOrderByInput, { nullable: true })
  orderBy?: EntityOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  // @Field(_type => WhereUniqueInput, { nullable: true })
  // after?: WhereUniqueInput | null;

  // @Field(_type => WhereUniqueInput, { nullable: true })
  // before?: WhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
