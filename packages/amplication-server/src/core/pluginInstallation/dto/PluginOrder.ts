import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import type { JsonValue } from "type-fest";
import { PluginOrderItem } from "./PluginOrderItem";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class PluginOrder extends IBlock {
  @Field(() => [PluginOrderItem], {
    nullable: false,
  })
  order!: PluginOrderItem[] & JsonValue;
}
