import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { PluginInstallationUpdateInput } from "./PluginInstallationUpdateInput";

@ArgsType()
export class UpdatePluginInstallationArgs extends UpdateBlockArgs {
  @Field(() => PluginInstallationUpdateInput, { nullable: false })
  declare data: PluginInstallationUpdateInput;
}
