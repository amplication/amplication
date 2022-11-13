import { Field, ObjectType, InputType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
@InputType("PropertySelectorInput", {
  isAbstract: true,
})
export class PropertySelector {
  @Field(() => String, {
    nullable: false,
  })
  propertyName!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  include!: boolean;
}
