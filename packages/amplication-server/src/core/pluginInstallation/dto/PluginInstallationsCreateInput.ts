import { Field, InputType } from "@nestjs/graphql";
import { PluginInstallationCreateInput } from "./PluginInstallationCreateInput";

@InputType({
  isAbstract: true,
})
export class PluginInstallationsCreateInput {
  @Field(() => [PluginInstallationCreateInput], {
    nullable: true,
  })
  plugins?: PluginInstallationCreateInput[];
}
