import { ArgsType, Field } from "@nestjs/graphql";
import { PluginInstallationCreateInput } from "./PluginInstallationCreateInput";

@ArgsType()
export class CreatePluginInstallationArgs {
  @Field(() => PluginInstallationCreateInput, { nullable: false })
  data!: PluginInstallationCreateInput;
}
