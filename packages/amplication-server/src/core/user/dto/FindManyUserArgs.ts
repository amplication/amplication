import { ArgsType, Field, Int } from '@nestjs/graphql';
import { UserOrderByInput } from './UserOrderByInput';
import { UserWhereInput } from './UserWhereInput';

@ArgsType()
export class FindManyUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(() => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
