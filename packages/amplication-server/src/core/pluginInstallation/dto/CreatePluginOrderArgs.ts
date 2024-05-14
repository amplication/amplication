import { ArgsType, Field } from "@nestjs/graphql";
import { PluginOrderCreateInput } from "./PluginOrderCreateInput";

@ArgsType()
export class CreatePluginOrderArgs {
  @Field(() => PluginOrderCreateInput, { nullable: false })
  data!: PluginOrderCreateInput;
}
