import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { StartConversationInput } from "../dto/StartConversationInput";
import { KafkaProducerService } from "../kafka/kafka.producer.service";
import { MyMessageBrokerTopics } from "../kafka/topics";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateService } from "../template/template.service";
import { ConversationTypeServiceBase } from "./base/conversationType.service.base";
import { AiConversationComplete } from "@amplication/schema-registry";

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

  async startConversion(message: StartConversationInput): Promise<void> {
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

      this.emitGptKafkaMessage(true, requestUniqueId, result);
    } catch (error) {
      this.emitGptKafkaMessage(false, requestUniqueId, error.message);
    }
  }

  private emitGptKafkaMessage(
    isCompleted: boolean,
    requestUniqueId: string,
    result: string
  ): void {
    const key = <AiConversationComplete.Key>{
      requestUniqueId,
    };
    const value = <AiConversationComplete.Value>{
      isGptConversionCompleted: isCompleted,
      ...(isCompleted ? { result } : { errorMessage: result }),
      requestUniqueId,
    };

    this.kafkaService
      .emitMessage(MyMessageBrokerTopics.AiConversationComplete_1, {
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
