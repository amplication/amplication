import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { PluginOrderUpdateInput } from "./PluginOrderUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdatePluginOrderArgs extends UpdateBlockArgs {
  @Field(() => PluginOrderUpdateInput, { nullable: false })
  declare data: PluginOrderUpdateInput;
}
