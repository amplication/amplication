import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PrivatePluginVersion } from "./PrivatePluginVersion";

@InputType({
  isAbstract: true,
})
export class PrivatePluginUpdateInput extends BlockUpdateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  //versions cannot be updated directly, only through the PrivatePluginVersionUpdateInput
  versions?: PrivatePluginVersion[];
}
