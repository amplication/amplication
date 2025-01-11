import { ArgsType, Field } from "@nestjs/graphql";
import { PrivatePluginCreateInput } from "./PrivatePluginCreateInput";

@ArgsType()
export class CreatePrivatePluginArgs {
  @Field(() => PrivatePluginCreateInput, { nullable: false })
  data!: PrivatePluginCreateInput;
}
