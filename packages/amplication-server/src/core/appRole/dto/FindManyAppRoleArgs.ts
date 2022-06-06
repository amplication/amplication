import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ResourceRoleOrderByInput } from './ResourceRoleOrderByInput';
import { ResourceRoleWhereInput } from './ResourceRoleWhereInput';

@ArgsType()
export class FindManyResourceRoleArgs {
  @Field(() => ResourceRoleWhereInput, { nullable: true })
  where?: ResourceRoleWhereInput | null;

  @Field(() => ResourceRoleOrderByInput, { nullable: true })
  orderBy?: ResourceRoleOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
