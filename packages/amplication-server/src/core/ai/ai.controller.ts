import { AiService } from "./ai.service";
import {
  AiConversationComplete,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller("ai-controller")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KAFKA_TOPICS.AI_CONVERSATION_COMPLETED_TOPIC)
  async onAiCoversationCompleted(
    @Payload() message: AiConversationComplete.Value
  ): Promise<void> {
    this.logger.debug(`onCoversationCompleted: ${message.requestUniqueId}`, {
      result: message.result,
    });
  }
}
