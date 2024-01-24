import { Injectable } from "@nestjs/common";
import { AmplicationError } from "../../errors/AmplicationError";
import { EnumDataType, PrismaService } from "../../prisma";
import { INVALID_RESOURCE_ID } from "./resource.service";
import {
  BreakTheMonolithPromptInput,
  BreakTheMonolithOutput,
  EntityDataForBtm,
  ResourceDataForBtm,
} from "./resourceBtm.types";
import { GptService } from "../gpt/gpt.service";
import { ConversationTypeKey } from "../gpt/gpt.types";
import { UserAction } from "../userAction/dto";
import { EnumUserActionStatus } from "../userAction/types";
import {
  BreakServiceToMicroservicesResult,
  BreakServiceToMicroservicesData,
} from "./dto/BreakServiceToMicroservicesResult";
import { UserActionService } from "../userAction/userAction.service";
import { GptBadFormatResponseError } from "./errors/GptBadFormatResponseError";

@Injectable()
export class ResourceBtmService {
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
  ): Promise<BreakServiceToMicroservicesResult> {
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
        originalResourceId: resourceId,
        data: null,
      };
    }

    const recommendations = await this.prepareBtmRecommendations(
      JSON.stringify(metadata),
      resourceId
    );

    return {
      status: EnumUserActionStatus.Completed,
      originalResourceId: resourceId,
      data: recommendations,
    };
  }

  generatePromptForBreakTheMonolith(resource: ResourceDataForBtm): string {
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

  async prepareBtmRecommendations(
    promptResult: string,
    resourceId: string
  ): Promise<BreakServiceToMicroservicesData> {
    const promptResultObj = this.mapToBreakTheMonolithOutput(promptResult);

    const recommendedResourceEntities = promptResultObj.microservices
      .map((resource) => resource.dataModels)
      .flat();

    const duplicatedEntities = this.findDuplicatedEntities(
      recommendedResourceEntities
    );
    const usedDuplicatedEntities = new Set<string>();

    const originalResource = await this.getResourceDataForBtm(resourceId);
    const originalResourceEntitiesSet = new Set(
      originalResource.entities.map((entity) => entity.name)
    );

    return {
      microservices: promptResultObj.microservices
        .sort((microservice) => -1 * microservice.dataModels.length)
        .map((microservice) => ({
          name: microservice.name,
          functionality: microservice.functionality,
          dataModels: microservice.dataModels
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
                {} as Record<string, EntityDataForBtm>
              );

              return {
                name: dataModelName,
                originalEntityId: entityNameIdMap[dataModelName]?.id,
              };
            }),
        })),
    };
  }

  mapToBreakTheMonolithOutput(promptResult: string): BreakTheMonolithOutput {
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
      throw new GptBadFormatResponseError(JSON.stringify(promptResult), error);
    }
  }

  findDuplicatedEntities(entities: string[]): Set<string> {
    return new Set(
      entities.filter((entity, index) => {
        return entities.indexOf(entity) !== index;
      })
    );
  }

  async getResourceDataForBtm(resourceId: string): Promise<ResourceDataForBtm> {
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
}
