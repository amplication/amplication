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
import { Injectable } from "@nestjs/common";
import { AiBadFormatResponseError } from "./errors/ai-bad-format-response.error";

@Injectable()
export class AiService {
  constructor(
    private readonly actionService: ActionService,
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

  private async updateActionStatus(
    actionId: string,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<void> {
    const userAction = await this.prisma.userAction.findFirst({
      where: {
        actionId,
        userActionType: GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
      },
      select: {
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
  }

  async triggerGenerationBtmResourceRecommendation({
    resourceId,
    userId,
  }: {
    resourceId: string;
    userId: string;
  }): Promise<string> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        name: true,
        entities: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
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
    const { actionId, errorMessage } = data;

    await this.updateActionStatus(
      actionId,
      errorMessage ? EnumActionStepStatus.Failed : EnumActionStepStatus.Success
    );

    return true;
  }
}
