import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoCreateInput } from "./ModuleDtoCreateInput";
import { ModuleDtoProperty } from "./ModuleDtoProperty";
import { ModuleDtoEnumMember } from "./ModuleDtoEnumMember";

@ArgsType()
export class CreateModuleDtoArgs {
  @Field(() => ModuleDtoCreateInput, { nullable: false })
  data!: ModuleDtoCreateInput;

  @Field(() => [ModuleDtoProperty], { nullable: true })
  properties?: ModuleDtoProperty[];

  @Field(() => [ModuleDtoEnumMember], { nullable: true })
  members?: ModuleDtoEnumMember[];
}
