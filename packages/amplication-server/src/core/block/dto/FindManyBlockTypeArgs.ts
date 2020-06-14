import { ArgsType, Field, Int } from '@nestjs/graphql';
import { BlockOrderByInput, BlockTypeWhereInput } from './';

@ArgsType()
export class FindManyBlockTypeArgs {
  @Field(() => BlockTypeWhereInput, { nullable: true })
  where?: BlockTypeWhereInput | null;

  @Field(() => BlockOrderByInput, { nullable: true })
  orderBy?: BlockOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
