import { ArgsType, Field } from "@nestjs/graphql";
import { UserRoleInput } from "./UserRoleInput";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UserRoleArgs {
  @Field(() => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
