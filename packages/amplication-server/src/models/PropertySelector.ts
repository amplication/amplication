import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('PropertySelectorInput', {
  isAbstract: true,
  description: undefined
})
export class PropertySelector {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  propertyName!: string;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  include!: boolean;
}
