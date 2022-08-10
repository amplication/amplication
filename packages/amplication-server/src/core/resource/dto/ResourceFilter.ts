import { Field, InputType } from '@nestjs/graphql';
import { ResourceWhereInput } from './ResourceWhereInput';

@InputType({
  isAbstract: true
})
export class ResourceFilter {
  @Field(() => ResourceWhereInput, {
    nullable: true
  })
  every?: ResourceWhereInput | null;

  @Field(() => ResourceWhereInput, {
    nullable: true
  })
  some?: ResourceWhereInput | null;

  @Field(() => ResourceWhereInput, {
    nullable: true
  })
  none?: ResourceWhereInput | null;
}
