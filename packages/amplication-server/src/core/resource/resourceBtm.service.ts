import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService } from "../../prisma";
import { EntityPartial, ResourcePartial } from "./resourceBtm.types";
import { AmplicationError } from "../../errors/AmplicationError";
import { INVALID_RESOURCE_ID } from "./resource.service";
import { ResourceBtmPromptService } from "./resourceBtmPrompt.service";
import { UserActionService } from "../userAction/userAction.service";
import { UserAction } from "../userAction/dto";
import { EnumActionStepStatus } from "../action/dto";
import { EnumUserActionStatus, EnumUserActionType } from "../userAction/types";
import { ConversationTypeKey } from "../gpt/ai.types";
import cuid from "cuid";
import { BreakTheMonolithPromptOutput } from "./resourceBtmPrompt.types";
import { BtmRecommendations } from "./dto/BtmRecommendations";
import { BreakServiceToMicroserviceResult } from "./dto/BreakServiceToMicroserviceResult";
import { AiService } from "../gpt/ai.service";

@Injectable()
export class ResourceBtmService {
  private actionStepName = "GENERATING_BTM_RESOURCE_RECOMMENDATION";

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly promptService: ResourceBtmPromptService,
    private readonly userActionService: UserActionService
  ) {}

  private async createUserAction(
    resourceId: string,
    userId: string
  ): Promise<UserAction> {
    return this.userActionService.createUserActionByTypeWithInitialStep(
      EnumUserActionType.BreakTheMonolith,
      {},
      <Prisma.ActionStepCreateWithoutActionInput>{
        name: this.actionStepName,
        message: "Emitting event to generate BTM resource recommendation",
        status: EnumActionStepStatus.Waiting,
      },
      userId,
      resourceId
    );
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

  duplicatedEntities(entites: string[]): Set<string> {
    return new Set(
      entites.filter((entity, index) => {
        return entites.indexOf(entity) !== index;
      })
    );
  }

  translateToBtmRecommendation(
    promptResult: BreakTheMonolithPromptOutput,
    originalResource: ResourcePartial
  ): BtmRecommendations {
    // validate all the entities in the original resource are present
    // at most once in the recommended resources and vice versa
    const recommendedResourceEntities = promptResult.microservices
      .map((resource) => resource.dataModels)
      .flat();

    const duplicatedEntities = this.duplicatedEntities(
      recommendedResourceEntities
    );
    const usedDuplicatedEntities = new Set<string>();

    const originalResourceEntitiesSet = new Set(
      originalResource.entities.map((entity) => entity.name)
    );

    return {
      microservices: promptResult.microservices
        .sort((microservice) => -1 * microservice.dataModels.length)
        .map((microservice) => ({
          id: cuid(),
          name: microservice.name,
          description: microservice.functionality,
          entities: microservice.dataModels
            .filter((dataModelName) => {
              const isDuplicatedAlreadyUsed =
                usedDuplicatedEntities.has(dataModelName);
              if (duplicatedEntities.has(dataModelName)) {
                usedDuplicatedEntities.add(dataModelName);
              }
              return (
                originalResourceEntitiesSet.has(dataModelName) &&
                !isDuplicatedAlreadyUsed
              );
            })
            .map((dataModelName) => {
              const entityNameIdMap = originalResource.entities.reduce(
                (map, entity) => {
                  map[entity.name] = entity;
                  return map;
                },
                {} as Record<string, EntityPartial>
              );

              return {
                id: cuid(),
                name: dataModelName,
                fields:
                  entityNameIdMap[dataModelName]?.versions[0]?.fields.map(
                    (field) => field.name
                  ) ?? [],
                originalEntityId: entityNameIdMap[dataModelName]?.id,
              };
            }),
        })),
    };
  }

  async triggerBreakServiceIntoMicroservices({
    resourceId,
    userId,
  }: {
    resourceId: string;
    userId: string;
  }): Promise<UserAction> {
    const resource = await this.getPartialResource(resourceId);

    const prompt = await this.promptService.generatePromptForBreakTheMonolith(
      resource
    );

    const userAction = await this.createUserAction(resourceId, userId);

    const conversationParams = [
      {
        name: "userInput",
        value: prompt,
      },
    ];

    await this.aiService.startConversation(
      userAction,
      ConversationTypeKey.BreakTheMonolith,
      conversationParams
    );

    return userAction;
  }

  async onCompleteBreakServiceIntoMicroservices(
    userAction: UserAction,
    success: boolean,
    errorMessage: string,
    result: string
  ): Promise<void> {
    const userActionStatus = success
      ? EnumActionStepStatus.Success
      : EnumActionStepStatus.Failed;

    let metadata: Record<string, any> = {};

    if (success) {
      const promptResult = this.promptService.parsePromptResult(result);
      const originalResource = await this.getPartialResource(
        userAction.resourceId
      );

      metadata = this.translateToBtmRecommendation(
        promptResult,
        originalResource
      );
    }

    await this.userActionService.updateUserActionMetadata(
      userAction.id,
      EnumUserActionType[userAction.userActionType],
      this.actionStepName,
      userActionStatus,
      success ? metadata : { errorMessage }
    );
  }

  async finalizeBreakServiceIntoMicroservices(
    userActionId: string
  ): Promise<BreakServiceToMicroserviceResult> {
    const { resourceId, metadata, status } =
      await this.userActionService.findOne({
        where: {
          id: userActionId,
        },
      });

    if (status !== EnumUserActionStatus.Completed) {
      return {
        status: EnumUserActionStatus[status],
        data: null,
      };
    }

    const recommendations = metadata as unknown as BtmRecommendations;

    const newResources: BreakServiceToMicroserviceResult["data"]["newResources"] =
      recommendations.microservices.map((resource) => ({
        id: resource.id,
        name: resource.name,
      }));

    const recommendedEntities: BreakServiceToMicroserviceResult["data"]["copiedEntities"] =
      [];
    for (const resource of recommendations.microservices) {
      for (const entity of resource.entities) {
        recommendedEntities.push({
          name: entity.name,
          entityId: entity.originalEntityId,
          targetResourceId: resource.id,
          originalResourceId: resourceId,
        });
      }
    }

    return {
      status: EnumUserActionStatus.Completed,
      data: {
        newResources: newResources,
        copiedEntities: recommendedEntities,
      },
    };
  }
}
