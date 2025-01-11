import { ArgsType, Field } from "@nestjs/graphql";
import { PrivatePluginVersionUpdateInput } from "./PrivatePluginVersionUpdateInput";
import { WherePrivatePluginVersionUniqueInput } from "./WherePrivatePluginVersionUniqueInput";

@ArgsType()
export class UpdatePrivatePluginVersionArgs {
  @Field(() => WherePrivatePluginVersionUniqueInput, { nullable: false })
  where!: WherePrivatePluginVersionUniqueInput;

  @Field(() => PrivatePluginVersionUpdateInput, { nullable: false })
  data: PrivatePluginVersionUpdateInput;
}
