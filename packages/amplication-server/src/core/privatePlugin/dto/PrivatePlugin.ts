import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

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
}
