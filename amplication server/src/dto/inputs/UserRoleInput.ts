import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";

import { Role  } from "../../enums/Role";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserRoleInput {
  @Field(_type => Role, {
    nullable: false,
    description: undefined
  })
  role: keyof typeof Role ;



}
