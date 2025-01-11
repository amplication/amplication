import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { ModuleDtoProperty } from "./ModuleDtoProperty";
import { ModuleDtoEnumMember } from "./ModuleDtoEnumMember";

@InputType({
  isAbstract: true,
})
export class ModuleDtoUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  //properties cannot be updated directly, only through the ModuleDtoPropertyUpdateInput
  properties?: ModuleDtoProperty[];

  //members cannot be updated directly, only through the ModuleDtoEnumMemberUpdateInput
  members?: ModuleDtoEnumMember[];
}
