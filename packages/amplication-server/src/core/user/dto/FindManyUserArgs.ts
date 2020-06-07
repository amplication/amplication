import { ArgsType, Field, Int } from '@nestjs/graphql';
import { UserOrderByInput, UserWhereInput } from './';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class FindManyUserArgs {
  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(_type => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => Int, { nullable: true })
  take?: number | null;
}
