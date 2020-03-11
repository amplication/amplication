import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";


@InputType({
  isAbstract: true,
  description: undefined,
})
export class OrganizationUpdateInput {

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  address?: string | null;

}
