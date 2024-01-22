import { Injectable } from "@nestjs/common";
import { AmplicationError } from "../../errors/AmplicationError";
import { EnumDataType, PrismaService } from "../../prisma";
import { INVALID_RESOURCE_ID } from "./resource.service";
import {
  BreakTheMonolithPromptInput,
  BreakTheMonolithPromptOutput,
  EntityPartial,
  ResourcePartial,
} from "./resourceBtm.types";
import cuid from "cuid";
import { GptService } from "../gpt/gpt.service";
import { ConversationTypeKey } from "../gpt/gpt.types";
import { UserAction } from "../userAction/dto";
import { EnumUserActionStatus } from "../userAction/types";
import { BreakServiceToMicroserviceResult } from "./dto/BreakServiceToMicroserviceResult";
import { BtmRecommendations } from "./dto/BtmRecommendations";
import { UserActionService } from "../userAction/userAction.service";
import { AiBadFormatResponseError } from "./errors/AiBadFormatResponseError";

@Injectable()
export class ResourceBtmService {
  private actionStepName = "GENERATING_BTM_RESOURCE_RECOMMENDATION";

  /* eslint-disable @typescript-eslint/naming-convention */
  private dataTypeMap: Record<keyof typeof EnumDataType, string> = {
    SingleLineText: "string",
    MultiLineText: "string",
    Email: "string",
    WholeNumber: "int",
    DateTime: "datetime",
    DecimalNumber: "float",
    Lookup: "enum",
    MultiSelectOptionSet: "enum",
    OptionSet: "enum",
    Boolean: "bool",
    GeographicLocation: "string",
    Id: "int",
    CreatedAt: "datetime",
    UpdatedAt: "datetime",
    Roles: "string",
    Username: "string",
    Password: "string",
    Json: "string",
  };

  constructor(
    private readonly gptService: GptService,
    private readonly prisma: PrismaService,
    private readonly userActionService: UserActionService
  ) {}

  private async getResourceDataForBtm(
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

  duplicatedEntities(entities: string[]): Set<string> {
    return new Set(
      entities.filter((entity, index) => {
        return entities.indexOf(entity) !== index;
      })
    );
  }

  async translateToBtmRecommendation(
    promptResult: BreakTheMonolithPromptOutput,
    resourceId: string
  ): Promise<BtmRecommendations> {
    // validate all the entities in the original resource are present
    // at most once in the recommended resources and vice versa
    const recommendedResourceEntities = promptResult.microservices
      .map((resource) => resource.dataModels)
      .flat();

    const duplicatedEntities = this.duplicatedEntities(
      recommendedResourceEntities
    );
    const usedDuplicatedEntities = new Set<string>();

    const originalResource = await this.getResourceDataForBtm(resourceId);
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
    const resource = await this.getResourceDataForBtm(resourceId);

    const prompt = this.generatePromptForBreakTheMonolith(resource);

    const conversationParams = [
      {
        name: "userInput",
        value: prompt,
      },
    ];

    const userAction = await this.gptService.startConversation(
      ConversationTypeKey.BreakTheMonolith,
      conversationParams,
      userId,
      resourceId
    );

    return userAction;
  }

  async finalizeBreakServiceIntoMicroservices(
    userActionId: string
  ): Promise<BreakServiceToMicroserviceResult> {
    const { resourceId, metadata } = await this.userActionService.findOne({
      where: {
        id: userActionId,
      },
    });

    const userActionStatus = await this.userActionService.calcUserActionStatus(
      userActionId
    );

    if (userActionStatus !== EnumUserActionStatus.Completed) {
      return {
        status: EnumUserActionStatus[userActionStatus],
        data: null,
      };
    }

    const promptResult = this.mapToBreakTheMonolithPromptOutput(
      JSON.stringify(metadata)
    );
    const recommendations = await this.translateToBtmRecommendation(
      promptResult,
      resourceId
    );

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
        newResources,
        copiedEntities: recommendedEntities,
      },
    };
  }

  generatePromptForBreakTheMonolith(resource: ResourcePartial): string {
    const entityIdNameMap = resource.entities.reduce((acc, entity) => {
      acc[entity.id] = entity.name;
      return acc;
    });

    const prompt: BreakTheMonolithPromptInput = {
      dataModels: resource.entities.map((entity) => {
        return {
          name: entity.name,
          fields: entity.versions[0].fields.map((field) => {
            return {
              name: field.name,
              dataType:
                field.dataType == EnumDataType.Lookup
                  ? entityIdNameMap[field.properties["relatedEntityId"]]
                  : this.dataTypeMap[field.dataType],
            };
          }),
        };
      }),
    };

    return JSON.stringify(prompt);
  }

  mapToBreakTheMonolithPromptOutput(
    promptResult: string
  ): BreakTheMonolithPromptOutput {
    try {
      const result = JSON.parse(promptResult);

      return {
        microservices: result.microservices.map((microservice) => ({
          name: microservice.name,
          functionality: microservice.functionality,
          dataModels: microservice.dataModels,
        })),
      };
    } catch (error) {
      throw new AiBadFormatResponseError(JSON.stringify(promptResult), error);
    }
  }
}
