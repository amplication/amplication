import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendAssistantMessageInput {
  @Field(() => String, {
    nullable: false,
  })
  message!: string;

  @Field(() => String, {
    nullable: true,
  })
  threadId?: string;
}
