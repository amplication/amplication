import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PluginOrderItem } from "./PluginOrderItem";

@InputType({
  isAbstract: true,
})
export class PluginOrderUpdateInput extends BlockUpdateInput {
  @Field(() => [PluginOrderItem], {
    nullable: false,
  })
  order!: PluginOrderItem[];
}
