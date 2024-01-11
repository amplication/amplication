import { IBlock } from "../../../models";
import { MessagePattern } from "./messagePattern/MessagePattern";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class ServiceTopics extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  messageBrokerId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => [MessagePattern], { nullable: false })
  patterns!: MessagePattern[];
}
