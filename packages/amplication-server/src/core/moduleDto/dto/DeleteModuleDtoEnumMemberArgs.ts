import { ArgsType, Field } from "@nestjs/graphql";
import { WhereEnumMemberUniqueInput } from "./WhereEnumMemberUniqueInput";

@ArgsType()
export class DeleteModuleDtoEnumMemberArgs {
  @Field(() => WhereEnumMemberUniqueInput, { nullable: false })
  where!: WhereEnumMemberUniqueInput;
}
