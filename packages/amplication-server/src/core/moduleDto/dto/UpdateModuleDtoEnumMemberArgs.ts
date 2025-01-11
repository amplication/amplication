import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoEnumMemberUpdateInput } from "./ModuleDtoEnumMemberUpdateInput";
import { WhereEnumMemberUniqueInput } from "./WhereEnumMemberUniqueInput";

@ArgsType()
export class UpdateModuleDtoEnumMemberArgs {
  @Field(() => WhereEnumMemberUniqueInput, { nullable: false })
  where!: WhereEnumMemberUniqueInput;

  @Field(() => ModuleDtoEnumMemberUpdateInput, { nullable: false })
  data: ModuleDtoEnumMemberUpdateInput;
}
