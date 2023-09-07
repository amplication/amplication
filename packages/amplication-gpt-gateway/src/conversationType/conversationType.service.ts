import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { StartConversationInput } from "../dto/StartConversationInput";
import { KafkaProducerService } from "../kafka/kafka.producer.service";
import { MyMessageBrokerTopics } from "../kafka/topics";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateService } from "../template/template.service";
import { ConversationTypeServiceBase } from "./base/conversationType.service.base";

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
    try {
      const { messageTypeKey, params, requestUniqueId } = message;
      const messageType = await this.prisma.conversationType.findUnique({
        where: {
          key: messageTypeKey,
        },
      });

      if (!messageType || !messageType.templateId) {
        this.logger.error(
          `Template not found for messageType: ${messageType}. process abort`
        );
        return;
      }

      const result = await this.templateService.processTemplateMessage({
        templateId: messageType.templateId,
        params,
      });
      if (!result) {
        this.logger.error(
          `Template not found for messageType: ${messageType}. process abort`
        );
        return;
      }

      await this.kafkaService.emitMessage(
        MyMessageBrokerTopics.GptConversationComplete,
        { key: requestUniqueId, value: result }
      );
    } catch (error) {
      this.logger.error(`Something went wrong: ${error}.`);
    }
  }
}
