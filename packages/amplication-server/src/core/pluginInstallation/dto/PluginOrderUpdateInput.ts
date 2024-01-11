import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PluginOrderItem } from "./PluginOrderItem";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class PluginOrderUpdateInput extends BlockUpdateInput {
  @Field(() => [PluginOrderItem], {
    nullable: false,
  })
  order!: PluginOrderItem[];
}
