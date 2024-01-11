import { IBlock } from "../../../models";
import { PluginOrderItem } from "./PluginOrderItem";
import { Field, ObjectType } from "@nestjs/graphql";
import type { JsonValue } from "type-fest";

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
