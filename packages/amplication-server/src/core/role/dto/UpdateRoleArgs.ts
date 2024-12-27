import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { RoleUpdateInput } from "./RoleUpdateInput";

@ArgsType()
export class UpdateRoleArgs {
  @Field(() => RoleUpdateInput, { nullable: false })
  data!: RoleUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
