import { Field, InputType } from '@nestjs/graphql';
import { ResourceWhereInput } from './ResourceWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ResourceFilter {
  @Field(() => ResourceWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: ResourceWhereInput | null;

  @Field(() => ResourceWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: ResourceWhereInput | null;

  @Field(() => ResourceWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: ResourceWhereInput | null;
}
