import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoEnumMemberCreateInput } from "./ModuleDtoEnumMemberCreateInput";

@ArgsType()
export class CreateModuleDtoEnumMemberArgs {
  @Field(() => ModuleDtoEnumMemberCreateInput, { nullable: false })
  data!: ModuleDtoEnumMemberCreateInput;
}
