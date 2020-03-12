import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereUniqueInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;
}
