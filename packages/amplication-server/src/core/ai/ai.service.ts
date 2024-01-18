import { AmplicationError } from "../../errors/AmplicationError";
import { PrismaService } from "../../prisma";
import { ActionService } from "../action/action.service";
import { EnumActionStepStatus } from "../action/dto";
import { INVALID_RESOURCE_ID } from "../resource/resource.service";
import { UserActionService } from "../userAction/userAction.service";
import {
  GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
  GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
  initialStepData,
} from "./constants";
import { PromptManagerService } from "./prompt-manager.service";
import {
  AiConversationComplete,
  AiConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Inject, Injectable } from "@nestjs/common";
import { AiBadFormatResponseError } from "./errors/ai-bad-format-response.error";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BtmManagerService } from "./btm-manager.service";
import {
  BtmRecommendationModelChanges,
  BtmRecommendationModelChangesInput,
} from "./dto";
import { ResourcePartial } from "./ai.types";

@Injectable()
export class AiService {
  constructor(
    private readonly actionService: ActionService,
    private readonly btmManagerService: BtmManagerService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly prisma: PrismaService,
    private readonly promptManagerService: PromptManagerService,
    private readonly userActionService: UserActionService
  ) {}

  private async createAction(
    resourceId: string,
    conversationTypeKey: string,
    conversationParams: any[],
    userId: string
  ): Promise<{
    actionId: string;
  }> {
    const userAction =
      await this.userActionService.createUserActionByTypeWithInitialStep(
        GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
        {
          resourceId,
          conversationTypeKey,
          conversationParams,
        },
        initialStepData,
        userId,
        resourceId
      );
    return {
      actionId: userAction.actionId,
    };
  }

  private async updateActionStatusAndGetResourceId(
    actionId: string,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<string> {
    const userAction = await this.prisma.userAction.findFirst({
      where: {
        actionId,
        userActionType: GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
      },
      select: {
        resourceId: true,
        action: {
          select: {
            steps: {
              where: {
                name: GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
              },
            },
          },
        },
      },
    });

    await this.actionService.complete(userAction.action.steps[0], status);

    return userAction.resourceId;
  }

  private async getPartialResource(
    resourceId: string
  ): Promise<ResourcePartial> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        id: true,
        name: true,
        entities: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            displayName: true,
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
    return resource;
  }

  async triggerGenerationBtmResourceRecommendation({
    resourceId,
    userId,
  }: {
    resourceId: string;
    userId: string;
  }): Promise<string> {
    const resource = await this.getPartialResource(resourceId);

    const prompt =
      await this.promptManagerService.generatePromptForBreakTheMonolith(
        resource
      );

    const conversationTypeKey = "BREAK_THE_MONOLITH";
    const conversationParams = [
      {
        name: "userInput",
        value: prompt,
      },
    ];

    const { actionId } = await this.createAction(
      resourceId,
      conversationTypeKey,
      conversationParams,
      userId
    );
    const requestUniqueId = `btm-${resourceId}-${actionId}`;

    const kafkaMessage: AiConversationStart.KafkaEvent = {
      key: { requestUniqueId },
      value: {
        actionId,
        requestUniqueId,
        messageTypeKey: conversationTypeKey,
        params: conversationParams,
      },
    };
    await this.kafkaProducerService.emitMessage(
      KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC,
      kafkaMessage
    );

    return prompt;
  }

  async onConversationCompleted(
    data: AiConversationComplete.Value
  ): Promise<boolean> {
    const { actionId, errorMessage, success, result } = data;

    try {
      const resourceId = await this.updateActionStatusAndGetResourceId(
        actionId,
        success ? EnumActionStepStatus.Success : EnumActionStepStatus.Failed
      );

      if (!success) {
        return true;
      }

      const originalResource = await this.getPartialResource(resourceId);

      const promptResult = this.promptManagerService.parsePromptResult(result);
      const recommendations =
        this.btmManagerService.translateToBtmRecommendation(
          actionId,
          promptResult,
          originalResource
        );

      const deleteOldRecommendations = this.prisma.resource.update({
        where: {
          id: resourceId,
        },
        data: {
          btmResourceRecommendation: {
            deleteMany: {},
          },
        },
      });

      const storeNewRecommendations = this.prisma.resource.update({
        where: {
          id: resourceId,
        },
        data: {
          btmResourceRecommendation: {
            create: recommendations.resources.map((resource) => ({
              name: resource.name,
              description: resource.description,
              btmEntityRecommendation: {
                create: resource.entities,
              },
            })),
          },
        },
      });

      await this.prisma.$transaction([
        deleteOldRecommendations,
        storeNewRecommendations,
      ]);
    } catch (error) {
      if (error instanceof AiBadFormatResponseError) {
        await this.updateActionStatusAndGetResourceId(
          actionId,
          EnumActionStepStatus.Failed
        );
      }
      this.logger.error(error.message, error, { errorMessage, result });
    }
    return true;
  }

  async btmRecommendationModelChanges(
    data: BtmRecommendationModelChangesInput
  ): Promise<BtmRecommendationModelChanges> {
    const { resourceId } = data;

    const btmResourceRecommendation =
      await this.prisma.btmResourceRecommendation.findMany({
        where: {
          resourceId: resourceId,
        },
        include: {
          btmEntityRecommendation: true,
        },
      });

    const newResources: BtmRecommendationModelChanges["newResources"] =
      btmResourceRecommendation.map((resource) => ({
        id: resource.id,
        name: resource.name,
      }));

    const recommendedEntities: BtmRecommendationModelChanges["copiedEntities"] =
      [];
    for (const resource of btmResourceRecommendation) {
      for (const entity of resource.btmEntityRecommendation) {
        recommendedEntities.push({
          name: entity.name,
          entityId: entity.originalEntityId,
          targetResourceId: resource.id,
          originalResourceId: resourceId,
        });
      }
    }

    return {
      newResources: newResources,
      copiedEntities: recommendedEntities,
    };
  }
}
