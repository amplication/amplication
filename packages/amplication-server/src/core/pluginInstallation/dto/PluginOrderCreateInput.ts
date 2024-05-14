import { Field, InputType } from "@nestjs/graphql";
import type { JsonValue } from "type-fest";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { PluginOrderItem } from "./PluginOrderItem";

@InputType({
  isAbstract: true,
})
export class PluginOrderCreateInput extends BlockCreateInput {
  @Field(() => [PluginOrderItem], {
    nullable: false,
  })
  order!: PluginOrderItem[] & JsonValue;
}
