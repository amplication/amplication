import { Field, InputType } from "@nestjs/graphql";
import type { JsonValue } from "type-fest";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { MessagePatternCreateInput } from "./messagePattern/MessagePatternCreateInput";

@InputType({
  isAbstract: true,
})
export class ServiceTopicsUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  messageBrokerId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => [MessagePatternCreateInput], { nullable: true })
  patterns?: MessagePatternCreateInput[] & JsonValue;
}
