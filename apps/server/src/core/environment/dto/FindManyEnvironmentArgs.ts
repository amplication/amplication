import { Field, ArgsType, Int } from '@nestjs/graphql';
import { EnvironmentOrderByInput } from './EnvironmentOrderByInput';
import { EnvironmentWhereInput } from './EnvironmentWhereInput';

@ArgsType()
export class FindManyEnvironmentArgs {
  @Field(() => EnvironmentWhereInput, { nullable: true })
  where?: EnvironmentWhereInput | null | undefined;

  @Field(() => EnvironmentOrderByInput, { nullable: true })
  orderBy?: EnvironmentOrderByInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
