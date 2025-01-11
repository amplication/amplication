import { ArgsType, Field } from "@nestjs/graphql";
import { PrivatePluginVersionCreateInput } from "./PrivatePluginVersionCreateInput";

@ArgsType()
export class CreatePrivatePluginVersionArgs {
  @Field(() => PrivatePluginVersionCreateInput, { nullable: false })
  data!: PrivatePluginVersionCreateInput;
}
