import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ResourceOrderByInput } from './ResourceOrderByInput';
import { ResourceWhereInput } from './ResourceWhereInput';

@ArgsType()
export class FindManyResourceArgs {
  @Field(() => ResourceWhereInput, { nullable: true })
  where?: ResourceWhereInput | null;

  @Field(() => ResourceOrderByInput, { nullable: true })
  orderBy?: ResourceOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
