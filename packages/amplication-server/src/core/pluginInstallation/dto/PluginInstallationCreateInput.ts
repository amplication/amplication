import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class PluginInstallationCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled: boolean;

  @Field(() => String, {
    nullable: false,
  })
  npm!: string;
}
