import { Field, InputType } from "@nestjs/graphql";
import { PluginInstallationsCreateInput } from "../../pluginInstallation/dto/PluginInstallationsCreateInput";
import { ResourceCreateInput } from "./ResourceCreateInput";

@InputType({
  isAbstract: true,
})
export class ServiceTemplateCreateInput {
  @Field(() => ResourceCreateInput, {
    nullable: false,
  })
  resource!: ResourceCreateInput;

  @Field(() => PluginInstallationsCreateInput, {
    nullable: true,
  })
  plugins?: PluginInstallationsCreateInput;
}
