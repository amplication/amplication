import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class PluginInstallationUpdateInput extends BlockUpdateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  pluginId!: string; //This field is set by the service, do not expose to the API

  npm!: string;
}
