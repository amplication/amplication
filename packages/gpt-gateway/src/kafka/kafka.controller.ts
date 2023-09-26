import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";
import { Controller, Inject } from "@nestjs/common";
import { StartConversationInput } from "../dto/StartConversationInput";
import { ConversationTypeService } from "../conversationType/conversationType.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Controller("kafka-controller")
export class KafkaController {
  constructor(
    protected readonly conversationType: ConversationTypeService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern("GptConversationStart")
  async onGptConversationStart(
    @Payload()
    message: KafkaMessage
  ): Promise<void> {
    const messageInput: StartConversationInput = JSON.parse(
      message.value.toString()
    );

    this.logger.info(`Got a new Gpt Conversation request item from queue.`, {
      requestedId: messageInput.requestUniqueId,
      params: messageInput.params,
      messageTypeKey: messageInput.messageTypeKey,
      class: this.constructor.name,
    });
    this.conversationType.startConversion(messageInput);
  }
}
