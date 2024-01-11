import { PluginOrderCreateInput } from "./PluginOrderCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreatePluginOrderArgs {
  @Field(() => PluginOrderCreateInput, { nullable: false })
  data!: PluginOrderCreateInput;
}
