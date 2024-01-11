import { PluginInstallationCreateInput } from "./PluginInstallationCreateInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class PluginInstallationsCreateInput {
  @Field(() => [PluginInstallationCreateInput], {
    nullable: true,
  })
  plugins?: PluginInstallationCreateInput[];
}
