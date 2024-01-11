import { WhereUniqueInput } from "../../../dto";
import { UserRoleInput } from "./UserRoleInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UserRoleArgs {
  @Field(() => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
