import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { PluginOrderUpdateInput } from "./PluginOrderUpdateInput";

@ArgsType()
export class UpdatePluginOrderArgs extends UpdateBlockArgs {
  @Field(() => PluginOrderUpdateInput, { nullable: false })
  declare data: PluginOrderUpdateInput;
}
