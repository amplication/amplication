import { Controller, Inject } from "@nestjs/common";
import { StartConversationInput } from "../dto/StartConversationInput";
import { ConversationTypeService } from "../conversationType/conversationType.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";

@Controller("kafka-controller")
export class KafkaController {
  constructor(
    protected readonly conversationType: ConversationTypeService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern("ai.conversation.start.1")
  async onAiConversationStart_1(
    @Payload()
    value: string | Record<string, any> | null,
    @Ctx()
    context: KafkaContext
  ): Promise<void> {
    const messageInput: StartConversationInput = JSON.parse(value.toString());

    this.logger.info(`Got a new Gpt Conversation request item from queue.`, {
      requestedId: messageInput.requestUniqueId,
      params: messageInput.params,
      messageTypeKey: messageInput.messageTypeKey,
      class: this.constructor.name,
    });
    this.conversationType.startConversion(messageInput);
  }
}
