import { KafkaProducerService } from "../kafka/kafka.producer.service";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateService } from "../template/template.service";
import { ConversationTypeServiceBase } from "./base/conversationType.service.base";
import {
  AiConversationComplete,
  AiConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ConversationTypeService extends ConversationTypeServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly kafkaService: KafkaProducerService,
    protected readonly templateService: TemplateService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    super(prisma);
  }

  async startConversionSync(message: AiConversationStart.Value): Promise<{
    success: boolean;
    requestUniqueId: string;
    result: string;
  }> {
    const { messageTypeKey, params, requestUniqueId } = message;

    try {
      const messageType = await this.prisma.conversationType.findUnique({
        where: {
          key: messageTypeKey,
        },
      });

      if (!messageType || !messageType.templateId) {
        throw Error(
          `Template not found for messageType: ${messageType}. process abort`
        );
      }

      const result = await this.templateService.processTemplateMessage({
        templateId: messageType.templateId,
        params,
      });

      return {
        success: true,
        requestUniqueId,
        result: result ?? "",
      };
    } catch (error) {
      this.logger.error(error.message, error);
      return {
        success: false,
        requestUniqueId,
        result: error.message,
      };
    }
  }

  async startConversion(message: AiConversationStart.Value): Promise<void> {
    const result = await this.startConversionSync(message);
    this.emitGptKafkaMessage(
      message.userActionId,
      result.requestUniqueId,
      result.success,
      result.result
    );
  }

  private emitGptKafkaMessage(
    userActionId: string,
    requestUniqueId: string,
    success: boolean,
    result: string
  ): void {
    const key: AiConversationComplete.Key = {
      requestUniqueId,
    };
    const value: AiConversationComplete.Value = {
      userActionId,
      requestUniqueId,
      success,
      ...(success ? { result } : { errorMessage: result }),
    };

    this.kafkaService
      .emitMessage(KAFKA_TOPICS.AI_CONVERSATION_COMPLETED_TOPIC, {
        key,
        value,
      })
      .catch((error) => {
        this.logger.error(
          `Failed to emit Gpt kafka message: ${requestUniqueId}`,
          error
        );
      });
  }
}
