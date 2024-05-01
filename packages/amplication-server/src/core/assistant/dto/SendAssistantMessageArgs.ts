import { ArgsType, Field } from "@nestjs/graphql";
import { SendAssistantMessageInput } from "./SendAssistantMessageInput";
import { AssistantContext } from "./AssistantContext";

@ArgsType()
export class SendAssistantMessageArgs {
  @Field(() => SendAssistantMessageInput, { nullable: false })
  data!: SendAssistantMessageInput;

  @Field(() => AssistantContext, { nullable: false })
  context: AssistantContext;
}
