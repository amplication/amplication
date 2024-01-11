import { AmplicationError } from "../../errors/AmplicationError";
import { PrismaService } from "../../prisma";
import { INVALID_RESOURCE_ID } from "../resource/resource.service";
import { PromptManagerService } from "./prompt-manager.service";
import {
  AiConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly promptManagerService: PromptManagerService,
    private readonly prisma: PrismaService
  ) {}

  async triggerGenerationBtmResourceRecommendation(
    resourceId: string
  ): Promise<string> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        name: true,
        entities: {
          where: {
            deletedAt: null,
          },
          select: {
            name: true,
            displayName: true,
            pluralDisplayName: true,
            versions: {
              where: {
                versionNumber: 0,
              },
              select: {
                fields: {
                  select: {
                    name: true,
                    displayName: true,
                    dataType: true,
                    properties: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!resource) {
      throw new AmplicationError(INVALID_RESOURCE_ID);
    }

    const prompt =
      await this.promptManagerService.generatePromptForBreakTheMonolith({
        resourceDisplayName: resource.name,
        resourceName: resource.name,
        entities: resource.entities.map((entity) => {
          return {
            name: entity.name,
            displayName: entity.displayName,
            fields: entity.versions[0].fields.map((field) => {
              return {
                name: field.name,
                displayName: field.displayName,
                dataType: field.dataType,
              };
            }),
          };
        }),
      });

    const requestUniqueId = `btm-${resourceId}-${Date.now()}`;
    const kafkaMessage: AiConversationStart.KafkaEvent = {
      key: { requestUniqueId },
      value: {
        requestUniqueId,
        messageTypeKey: "BREAK_THE_MONOLITH",
        params: [
          {
            name: "userInput",
            value: prompt,
          },
        ],
      },
    };

    await this.kafkaProducerService.emitMessage(
      KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC,
      kafkaMessage
    );

    return prompt;
  }

  async onCoversationCompleted(): Promise<boolean> {
    return true;
  }
}
