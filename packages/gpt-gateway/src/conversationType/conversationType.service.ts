import { KafkaProducerService } from "../kafka/kafka.producer.service";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateService } from "../template/template.service";
import { ConversationTypeServiceBase } from "./base/conversationType.service.base";
import {
  GptConversationComplete,
  GptConversationStart,
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

  async startConversionSync(message: GptConversationStart.Value): Promise<{
    requestUniqueId: string;
    success: boolean;
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
        requestUniqueId,
        success: true,
        result: result ?? "",
      };
    } catch (error) {
      this.logger.error(error.message, error);
      return {
        requestUniqueId,
        success: false,
        result: error.message,
      };
    }
  }

  async startConversion(message: GptConversationStart.Value): Promise<void> {
    const result = await this.startConversionSync(message);
    this.emitGptKafkaMessage(
      message.requestUniqueId,
      result.success,
      result.result
    );
  }

  private emitGptKafkaMessage(
    requestUniqueId: string,
    success: boolean,
    result: string
  ): void {
    const key: GptConversationComplete.Key = {
      requestUniqueId,
    };
    const value: GptConversationComplete.Value = {
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
