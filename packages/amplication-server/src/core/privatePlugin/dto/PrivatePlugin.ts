import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { PrivatePluginVersion } from "./PrivatePluginVersion";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class PrivatePlugin extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => [PrivatePluginVersion], {
    nullable: false,
  })
  versions: PrivatePluginVersion[];
}
