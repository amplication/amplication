import { Field, InputType } from '@nestjs/graphql';
import { EntityWhereInput } from './EntityWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFilter {
  @Field(_type => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: EntityWhereInput | null;

  @Field(_type => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: EntityWhereInput | null;

  @Field(_type => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: EntityWhereInput | null;
}
