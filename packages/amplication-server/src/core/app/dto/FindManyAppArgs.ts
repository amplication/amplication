import { ArgsType, Field, Int } from '@nestjs/graphql';
import { AppOrderByInput } from './AppOrderByInput';
import { AppWhereInput } from './AppWhereInput';

@ArgsType()
export class FindManyAppArgs {
  @Field(() => AppWhereInput, { nullable: true })
  where?: AppWhereInput | null;

  @Field(() => AppOrderByInput, { nullable: true })
  orderBy?: AppOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
