import { Injectable } from "@nestjs/common";
import { MessageInput } from "../dto/MessageInput";
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
    protected readonly templateService: TemplateService
  ) {
    super(prisma);
  }

  async startConversion(message: MessageInput): Promise<void> {
    const { messageTypeId, params, requestUniqueId } = message;
    const messageType = await this.prisma.conversationType.findUnique({
      where: {
        key: messageTypeKey,
      },
    });

    if (!messageType || !messageType.templateId)
      throw new Error("Template not found");

    const result = await this.templateService.processTemplateMessage({
      templateId: messageType.templateId,
      params,
    });
    if (!result) throw new Error("Template not found");

    await this.kafkaService.emitMessage(
      MyMessageBrokerTopics.Completegptchatcompletion,
      { key: requestUniqueId, value: result }
    );
  }
}
