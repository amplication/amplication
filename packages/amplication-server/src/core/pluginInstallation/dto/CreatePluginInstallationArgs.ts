import { PluginInstallationCreateInput } from "./PluginInstallationCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreatePluginInstallationArgs {
  @Field(() => PluginInstallationCreateInput, { nullable: false })
  data!: PluginInstallationCreateInput;
}
