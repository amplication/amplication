import { ConversationTypeService } from "../conversationType/conversationType.service";
import { AiConversationStart } from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";

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
    value: AiConversationStart.Value,
    @Ctx()
    context: KafkaContext
  ): Promise<void> {
    const messageInput = plainToInstance(AiConversationStart.Value, value);

    this.logger.info(`Got a new Gpt Conversation request item from queue.`, {
      requestedId: messageInput.requestUniqueId,
      params: messageInput.params,
      messageTypeKey: messageInput.messageTypeKey,
      class: this.constructor.name,
    });
    this.conversationType.startConversion(messageInput);
  }
}
