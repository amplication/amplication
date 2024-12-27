import { Field, InputType } from "@nestjs/graphql";
import { EnumRole } from "../../../enums/EnumRole";

@InputType({
  isAbstract: true,
})
export class UserRoleInput {
  @Field(() => EnumRole, {
    nullable: false,
  })
  role: EnumRole;
}
