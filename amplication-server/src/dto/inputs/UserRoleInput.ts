import { Field, InputType } from "@nestjs/graphql";
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
