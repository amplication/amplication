import { Field, InputType } from '@nestjs/graphql';
import { ResourceRoleWhereInput } from './ResourceRoleWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ResourceRoleFilter {
  @Field(() => ResourceRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: ResourceRoleWhereInput | null;

  @Field(() => ResourceRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: ResourceRoleWhereInput | null;

  @Field(() => ResourceRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: ResourceRoleWhereInput | null;
}
