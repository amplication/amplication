import { Field, InputType } from '@nestjs/graphql';
import { ResourceWhereInput } from 'src/core/resource/dto';

@InputType({
  isAbstract: true
})
export class ResourceListRelationFilter {
  @Field(() => ResourceWhereInput, { nullable: true })
  every?: ResourceWhereInput;

  @Field(() => ResourceWhereInput, { nullable: true })
  some?: ResourceWhereInput;

  @Field(() => ResourceWhereInput, { nullable: true })
  none?: ResourceWhereInput;
}
