import { Controller, Inject } from "@nestjs/common";
import { ConversationTypeService } from "../conversationType/conversationType.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import {
  AiConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

@Controller("kafka-controller")
export class KafkaController {
  constructor(
    protected readonly conversationType: ConversationTypeService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC)
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
