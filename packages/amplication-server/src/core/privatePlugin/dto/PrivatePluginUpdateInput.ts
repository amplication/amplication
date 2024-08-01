import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class PrivatePluginUpdateInput extends BlockUpdateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;
}
