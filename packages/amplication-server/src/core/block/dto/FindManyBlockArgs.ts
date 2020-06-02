import { BlockOrderByInput, BlockWhereInput } from './';

export class FindManyBlockArgs {
  where?: BlockWhereInput | null;

  orderBy?: BlockOrderByInput | null;

  skip?: number | null;

  // @Field(() => BlockWhereUniqueInput, { nullable: true })
  // after?: BlockWhereUniqueInput | null;

  // @Field(() => BlockWhereUniqueInput, { nullable: true })
  // before?: BlockWhereUniqueInput | null;

  first?: number | null;

  last?: number | null;
}
