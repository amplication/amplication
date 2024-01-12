import { AiConversationStart } from "@amplication/schema-registry";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
class MessageParam {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  value!: string;
}

@InputType()
export class CreateConversationInput extends AiConversationStart.Value {
  @Field(() => String, {
    nullable: false,
  })
  declare messageTypeKey: string;

  @Field(() => String, {
    nullable: false,
  })
  declare requestUniqueId: string;

  @Field(() => [MessageParam], {
    nullable: false,
  })
  declare params: MessageParam[];
}
