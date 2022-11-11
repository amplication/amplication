import { Field, ArgsType, Int } from '@nestjs/graphql';
import { BuildOrderByInput } from './BuildOrderByInput';
import { BuildWhereInput } from './BuildWhereInput';

@ArgsType()
export class FindManyBuildArgs {
  @Field(() => BuildWhereInput, { nullable: true })
  where?: BuildWhereInput | null | undefined;

  @Field(() => BuildOrderByInput, { nullable: true })
  orderBy?: BuildOrderByInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
