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
import { GptBadFormatResponseError } from "./errors/GptBadFormatResponseError";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { Resource, User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { types } from "@amplication/code-gen-types";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { BillingFeature } from "@amplication/util-billing-types";
import { EnumResourceType } from "./dto/EnumResourceType";
import { v4 } from "uuid";
import { BREAK_THE_MONOLITH_AI_ERROR_MESSAGE } from "./constants";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";

@Injectable()
export class ResourceBtmService {
  constructor(
    private readonly gptService: GptService,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly analyticsService: SegmentAnalyticsService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly logger: AmplicationLogger
  ) {}

  private async trackEvent(
    user: User,
    resource: Resource | ResourceDataForBtm,
    eventName: EnumEventType,
    customProperties: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      const subscription = await this.billingService.getSubscription(
        user.workspace?.id
      );

      await this.analyticsService.trackWithContext({
        properties: {
          projectId: resource.project?.id,
          resourceId: resource.id,
          serviceName: resource.name,
          plan: subscription.subscriptionPlan,
          ...customProperties,
        },
        event: eventName,
      });
    } catch (error) {
      this.logger.error(error.message, error, {
        userId: user.id,
        workspaceId: user.workspace?.id,
        resourceId: resource.id,
      });
      throw new AmplicationError(error.message);
    }
  }

  private async checkAccessToBreakTheMonolithWithGpt(user: User) {
    if (this.billingService.isBillingEnabled) {
      const userWorkspace = await this.prisma.workspace.findUnique({
        where: {
          id: user.workspace?.id,
        },
      });
      const btmWithGpt = (
        await this.billingService.getBooleanEntitlement(
          user.workspace?.id,
          BillingFeature.RedesignArchitecture
        )
      ).hasAccess;

      if (!btmWithGpt) {
        throw new BillingLimitationError(
          "Available as part of the Enterprise plan only.",
          BillingFeature.RedesignArchitecture
        );
      } else if (!userWorkspace.allowLLMFeatures) {
        throw new AmplicationError(
          "your workspace settings forbid LLM features use."
        );
      }
    }
  }

  async startRedesign(user: User, resourceId: string): Promise<Resource> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        project: true,
      },
    });

    await this.trackEvent(
      user,
      resource,
      EnumEventType.ArchitectureRedesignStartRedesign
    );

    return resource;
  }

  async triggerBreakServiceIntoMicroservices({
    resourceId,
    user,
  }: {
    resourceId: string;
    user: User;
  }): Promise<UserAction> {
    await this.checkAccessToBreakTheMonolithWithGpt(user);
    const resource = await this.getResourceDataForBtm(resourceId);

    if (resource.entities && resource.entities.length === 0) {
      throw new AmplicationError("Resource has no entities");
    }

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
      user.id,
      resourceId
    );

    await this.trackEvent(
      user,
      resource,
      EnumEventType.ArchitectureRedesignStartBreakTheMonolith
    );
    return userAction;
  }

  async finalizeBreakServiceIntoMicroservices(
    userActionId: string,
    user: User
  ): Promise<BreakServiceToMicroservicesResult> {
    const {
      status: userActionStatus,
      resourceId,
      metadata,
    } = await this.gptService.getConversationUserAction(userActionId);

    if (userActionStatus !== EnumUserActionStatus.Completed) {
      return {
        status: EnumUserActionStatus[userActionStatus],
        originalResourceId: resourceId,
        data: null,
      };
    }

    try {
      const recommendations = await this.prepareBtmRecommendations(
        metadata.data,
        resourceId,
        user
      );

      return {
        status: EnumUserActionStatus.Completed,
        originalResourceId: resourceId,
        data: recommendations,
      };
    } catch (error) {
      this.logger.error(error.message, error, { userActionId });
      throw new AmplicationError(BREAK_THE_MONOLITH_AI_ERROR_MESSAGE);
    }
  }

  generatePromptForBreakTheMonolith(resource: ResourceDataForBtm): string {
    const entityNameToRelatedFieldsMap = resource.entities.reduce(
      (acc, entity) => {
        const relationFields = entity.versions[0].fields.filter(
          (field) => field.dataType === EnumDataType.Lookup
        );

        const relatedEntityFieldNames = relationFields.length
          ? [
              ...new Set(
                relationFields.map((field) => {
                  const relatedEntity = (
                    field.properties as unknown as types.Lookup
                  ).relatedEntityId;
                  const relatedEntityName = resource.entities.find(
                    (entity) => entity.id === relatedEntity
                  )?.name;
                  return relatedEntityName;
                })
              ),
            ]
          : [];

        acc[entity.name] = relatedEntityFieldNames;
        return acc;
      },
      {} as Record<string, string[]>
    );

    const prompt: BreakTheMonolithPromptInput = {
      tables: Object.entries(entityNameToRelatedFieldsMap).map(
        ([name, relations]) => ({
          name,
          relations,
        })
      ),
    };

    return JSON.stringify(prompt);
  }

  handleProjectServicesCollision(
    projectServices: { name: string }[],
    serviceName: string
  ): string {
    let validServiceName = serviceName;
    projectServices.forEach((service) => {
      const isDuplicated = service.name === serviceName;

      if (isDuplicated) {
        const suffix = v4().split("-")[0];
        validServiceName = `${serviceName}_${suffix}`;
      }
    });
    return validServiceName;
  }

  /**
   * This function prepares the GPT recommendation for the Break the Monolith result
   * It filters out the tables that the GPT result has that the original resource doesn't have
   * It makes sure that there are no duplicated tables in the microservices by removing the duplicates and putting them on the microservice with the least amount of tables
   * It makes sure that the result will not includes microservices with no tables
   * It renames microservices that have the same name as a service in the project
   * @param promptResult - GPT recommendation
   * @param resourceId
   * @returns the GPT recommendation with some data structure manipulation
   */
  async prepareBtmRecommendations(
    promptResult: string,
    resourceId: string,
    user: User
  ): Promise<BreakServiceToMicroservicesData> {
    const promptResultObj = this.mapToBreakTheMonolithOutput(promptResult);
    const originalResource = await this.getResourceDataForBtm(resourceId);
    const originalResourceEntityNamesSet = new Set(
      originalResource.entities.map((entity) => entity.name)
    );
    const serviceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: { id: resourceId },
        },
        user
      );
    const recommendedResourceEntities = promptResultObj.microservices
      .map((resource) => resource.tables)
      .flat();

    let inventedEntitiesByGpt: string[] = [];
    let duplicatedEntities = new Set<string>();
    const usedDuplicatedEntities = new Set<string>();

    const projectServices = await this.prisma.resource.findMany({
      where: {
        projectId: originalResource.project?.id,
        deletedAt: null,
        resourceType: EnumResourceType.Service,
      },
      select: {
        name: true,
      },
    });

    const microserviceNameToTablesMap = promptResultObj.microservices
      .filter((microservice) => microservice.tables.length > 0)
      .map((microservice) => {
        duplicatedEntities = this.findDuplicatedEntities(
          recommendedResourceEntities
        );
        inventedEntitiesByGpt = recommendedResourceEntities.filter(
          (item) => !originalResourceEntityNamesSet.has(item)
        );
        return {
          name: this.handleProjectServicesCollision(
            projectServices,
            microservice.name
          ),
          functionality: microservice.functionality,
          tables: microservice.tables,
        };
      })
      .sort((a, b) => a.tables.length - b.tables.length)
      .reduce(
        (
          acc: Record<string, { functionality: string; tables: string[] }>,
          microservice
        ) => {
          acc[microservice.name] = {
            functionality: microservice.functionality,
            tables: microservice.tables,
          };
          return acc;
        },
        {}
      );

    const microserviceData = Object.entries(microserviceNameToTablesMap).map(
      ([microserviceName, { functionality, tables }]) => {
        const microserviceTables = tables
          .filter((tableName) => {
            const isDuplicatedAlreadyUsed =
              usedDuplicatedEntities.has(tableName);
            if (!isDuplicatedAlreadyUsed && duplicatedEntities.has(tableName)) {
              usedDuplicatedEntities.add(tableName);
            }
            return (
              originalResourceEntityNamesSet.has(tableName) &&
              !isDuplicatedAlreadyUsed &&
              !inventedEntitiesByGpt.includes(tableName) &&
              !(
                serviceSettings?.authEntityName &&
                serviceSettings.authEntityName === tableName
              )
            );
          })
          .map((tableName) => {
            const entityNameIdMap = originalResource.entities.reduce(
              (map, entity) => {
                map[entity.name] = entity;
                return map;
              },
              {} as Record<string, EntityDataForBtm>
            );

            return {
              name: tableName,
              originalEntityId: entityNameIdMap[tableName].id,
            };
          });

        return {
          name: microserviceName,
          functionality: functionality,
          tables: microserviceTables,
        };
      }
    );

    return {
      microservices: microserviceData,
    };
  }

  mapToBreakTheMonolithOutput(promptResult: string): BreakTheMonolithOutput {
    try {
      const result = JSON.parse(promptResult);

      return {
        microservices: result.microservices.map((microservice) => ({
          name: microservice.name,
          functionality: microservice.functionality,
          tables: microservice.tables,
        })),
      };
    } catch (error) {
      throw new GptBadFormatResponseError(promptResult, error);
    }
  }

  findDuplicatedEntities(entities: string[]): Set<string> {
    const duplicates = new Set<string>();
    const seen = new Set<string>();

    for (const entity of entities) {
      if (seen.has(entity)) {
        duplicates.add(entity);
      } else {
        seen.add(entity);
      }
    }

    return duplicates;
  }

  async getResourceDataForBtm(resourceId: string): Promise<ResourceDataForBtm> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        id: true,
        name: true,
        project: true,
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
