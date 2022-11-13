import { Field, InputType } from '@nestjs/graphql';
import { EntityWhereInput } from './EntityWhereInput';

@InputType({
  isAbstract: true
})
export class EntityFilter {
  @Field(() => EntityWhereInput, {
    nullable: true
  })
  every?: EntityWhereInput | null;

  @Field(() => EntityWhereInput, {
    nullable: true
  })
  some?: EntityWhereInput | null;

  @Field(() => EntityWhereInput, {
    nullable: true
  })
  none?: EntityWhereInput | null;
}
