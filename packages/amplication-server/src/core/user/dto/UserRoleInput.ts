import { Role } from "../../../enums/Role";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class UserRoleInput {
  @Field(() => Role, {
    nullable: false,
  })
  role: Role;
}
