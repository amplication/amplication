import { Field, InputType } from "@nestjs/graphql";
import { MessageParam } from "../dto/MessageParam";

@InputType()
class MessageInput {
  @Field(() => String, {
    nullable: true,
  })
  requestUniqueId!: string;

  @Field(() => String, {
    nullable: true,
  })
  messageTypeId!: string;

  @Field(() => [MessageParam])
  params!: MessageParam[];
}

export { MessageInput };
