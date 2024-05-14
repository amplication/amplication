import { GptService } from "./gpt.service";
import {
  GptConversationComplete,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller("gpt-controller")
export class GptController {
  constructor(
    private readonly gptService: GptService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KAFKA_TOPICS.AI_CONVERSATION_COMPLETED_TOPIC)
  async onAiConversationCompleted(
    @Payload() message: GptConversationComplete.Value
  ): Promise<void> {
    this.logger.debug(
      `RECEIVED: onConversationCompleted ${message.requestUniqueId} `,
      {
        result: message.result,
      }
    );
    try {
      await this.gptService.onConversationCompleted(message);
      this.logger.debug(
        `COMPLETED: onConversationCompleted ${message.requestUniqueId}`
      );
    } catch (error) {
      this.logger.error(error.message, error, { message });
    }
  }
}
