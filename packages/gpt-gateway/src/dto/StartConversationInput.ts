import { Field, InputType } from "@nestjs/graphql";
import { MessageParam } from "./MessageParam";

@InputType()
class StartConversationInput {
  @Field(() => String, {
    nullable: true,
  })
  requestUniqueId!: string;

  @Field(() => String, {
    nullable: true,
  })
  messageTypeKey!: string;

  @Field(() => [MessageParam])
  params!: MessageParam[];
}

export { StartConversationInput };
