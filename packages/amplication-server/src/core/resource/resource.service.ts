import {
  EnumActionStepStatus,
  RedesignProjectMovedEntity,
} from "@amplication/code-gen-types/models";
import { Lookup } from "@amplication/code-gen-types/types";
import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import cuid from "cuid";
import { isEmpty } from "lodash";
import { pascalCase } from "pascal-case";
import pluralize from "pluralize";
import { JsonObject, JsonValue } from "type-fest";
import { FindOneArgs } from "../../dto";
import { EnumDataType } from "../../enums/EnumDataType";
import { QueryMode } from "../../enums/QueryMode";
import { AmplicationError } from "../../errors/AmplicationError";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { GitOrganization, Project, Resource, User } from "../../models";
import {
  EnumResourceType,
  GitRepository,
  Prisma,
  PrismaService,
} from "../../prisma";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { prepareDeletedItemName } from "../../util/softDelete";
import { ActionService } from "../action/action.service";
import { EnumActionLogLevel } from "../action/dto/EnumActionLogLevel";
import { BillingService } from "../billing/billing.service";
import {
  DATA_TYPE_TO_DEFAULT_PROPERTIES,
  USER_ENTITY_NAME,
} from "../entity/constants";
import {
  CreateBulkEntitiesAndFieldsArgs,
  CreateBulkEntitiesInput,
  CreateBulkFieldsInput,
  EntityService,
} from "../entity/entity.service";
import { EnvironmentService } from "../environment/environment.service";
import { ConnectGitRepositoryInput } from "../git/dto/inputs/ConnectGitRepositoryInput";
import { PluginInstallationCreateInput } from "../pluginInstallation/dto/PluginInstallationCreateInput";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { ProjectConfigurationSettingsService } from "../projectConfigurationSettings/projectConfigurationSettings.service";
import { EnumAuthProviderType } from "../serviceSettings/dto/EnumAuthenticationProviderType";
import { ServiceSettingsUpdateInput } from "../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { TopicService } from "../topic/topic.service";
import { UserAction } from "../userAction/dto";
import { EnumUserActionType } from "../userAction/types";
import { UserActionService } from "../userAction/userAction.service";
import { ReservedEntityNameError } from "./ReservedEntityNameError";
import { REDESIGN_PROJECT_INITIAL_STEP_DATA } from "./constants";
import {
  CreateOneResourceArgs,
  FindManyResourceArgs,
  ResourceCreateWithEntitiesInput,
  ResourceCreateWithEntitiesResult,
  UpdateCodeGeneratorVersionArgs,
  UpdateOneResourceArgs,
} from "./dto";
import { RedesignProjectArgs } from "./dto/RedesignProjectArgs";
import { ProjectConfigurationExistError } from "./errors/ProjectConfigurationExistError";
import { EnumRelatedFieldStrategy } from "../entity/dto/EnumRelatedFieldStrategy";

const USER_RESOURCE_ROLE = {
  name: "user",
  displayName: "User",
};

export const DEFAULT_ENVIRONMENT_NAME = "Sandbox environment";
export const INITIAL_COMMIT_MESSAGE = "Initial Commit";

export const INVALID_RESOURCE_ID = "Invalid resourceId";
export const INVALID_DELETE_PROJECT_CONFIGURATION =
  "The resource of type `ProjectConfiguration` cannot be deleted";

const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  "This resource is used to store project configuration.";

export type CreatePreviewServiceArgs = {
  args: CreateOneResourceArgs;
  user: User;
  nonDefaultPluginsToInstall: PluginInstallationCreateInput[];
  requireAuthenticationEntity: boolean;
};

const DEFAULT_DB_PLUGIN: PluginInstallationCreateInput = {
  pluginId: "db-postgres",
  enabled: true,
  npm: "@amplication/plugin-db-postgres",
  version: "latest",
  displayName: "db-postgres",
  resource: undefined,
};

const DEFAULT_AUTH_PLUGINS: PluginInstallationCreateInput[] = [
  {
    displayName: "Auth-core",
    pluginId: "auth-core",
    npm: "@amplication/plugin-auth-core",
    version: "latest",
    enabled: true,
    resource: undefined,
  },
  {
    displayName: "Auth-jwt",
    pluginId: "auth-jwt",
    npm: "@amplication/plugin-auth-jwt",
    version: "latest",
    enabled: true,
    resource: undefined,
  },
];

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger,
    private entityService: EntityService,
    private environmentService: EnvironmentService,
    private serviceSettingsService: ServiceSettingsService,
    private readonly projectConfigurationSettingsService: ProjectConfigurationSettingsService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly serviceTopicsService: ServiceTopicsService,
    private readonly topicService: TopicService,
    private readonly billingService: BillingService,
    private readonly pluginInstallationService: PluginInstallationService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly actionService: ActionService,
    private readonly userActionService: UserActionService
  ) {}

  async findOne(args: FindOneArgs): Promise<Resource | null> {
    return this.prisma.resource.findUnique(args);
  }

  async createProjectConfiguration(
    projectId: string,
    projectName: string,
    userId: string
  ): Promise<Resource> {
    const existingProjectConfiguration = await this.prisma.resource.findFirst({
      where: { projectId, resourceType: EnumResourceType.ProjectConfiguration },
    });

    if (!isEmpty(existingProjectConfiguration)) {
      throw new ProjectConfigurationExistError();
    }

    const newProjectConfiguration = await this.prisma.resource.create({
      data: {
        resourceType: EnumResourceType.ProjectConfiguration,
        description: DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION,
        name: projectName,
        project: { connect: { id: projectId } },
      },
    });
    await this.projectConfigurationSettingsService.createDefault(
      newProjectConfiguration.id,
      userId
    );
    return newProjectConfiguration;
  }

  /**
   * Create a resource
   * This function should be called from one of the other "Create[ResourceType] functions like CreateService, CreateMessageBroker etc."
   */
  private async createResource(
    args: CreateOneResourceArgs,
    user: User,
    gitRepositoryToCreate: ConnectGitRepositoryInput = null,
    wizardType: string = null
  ): Promise<Resource> {
    if (args.data.resourceType === EnumResourceType.ProjectConfiguration) {
      throw new AmplicationError(
        "Resource of type Project Configuration cannot be created manually"
      );
    }

    if (this.billingService.isBillingEnabled) {
      const serviceEntitlement =
        await this.billingService.getMeteredEntitlement(
          user.workspace.id,
          BillingFeature.Services
        );

      if (serviceEntitlement && !serviceEntitlement.hasAccess) {
        const message = `Your project exceeds its services limitation.`;
        throw new BillingLimitationError(message, BillingFeature.Services);
      }
    }

    const projectId = args.data.project.connect.id;

    const projectConfiguration = await this.projectConfiguration(projectId);

    if (isEmpty(projectConfiguration)) {
      throw new AmplicationError("Project configuration missing from project");
    }

    const originalName = args.data.name;
    const existingResources = await this.prisma.resource.findMany({
      where: {
        name: {
          mode: QueryMode.Insensitive,
          startsWith: args.data.name.toLowerCase(),
        },
        projectId: projectId,
        deletedAt: null,
        archived: { not: true },
      },
      select: {
        name: true,
      },
    });

    let index = 1;
    while (
      existingResources.find((resource) => {
        return resource.name.toLowerCase() === args.data.name.toLowerCase();
      })
    ) {
      args.data.name = `${originalName}-${index}`;
      index += 1;
    }

    let gitRepository:
      | Prisma.GitRepositoryCreateNestedOneWithoutResourcesInput
      | undefined = undefined;

    const isOnBoarding = wizardType?.toLowerCase() === "onboarding";

    if (
      args.data.resourceType === EnumResourceType.Service &&
      gitRepositoryToCreate &&
      !gitRepositoryToCreate?.isOverrideGitRepository
    ) {
      if (!projectConfiguration.gitRepositoryId) {
        const wizardGitRepository = await this.prisma.gitRepository.create({
          data: {
            name: gitRepositoryToCreate.name,
            groupName: gitRepositoryToCreate.groupName,
            resources: {},
            gitOrganization: {
              connect: { id: gitRepositoryToCreate.gitOrganizationId },
            },
          },
        });

        gitRepository = {
          connect: { id: wizardGitRepository.id },
        };
      } else {
        gitRepository = {
          connect: { id: projectConfiguration.gitRepositoryId },
        };
      }
    }

    if (
      args.data.resourceType === EnumResourceType.Service &&
      gitRepositoryToCreate &&
      (gitRepositoryToCreate?.isOverrideGitRepository || isOnBoarding)
    ) {
      const wizardGitRepository = await this.prisma.gitRepository.create({
        data: {
          name: gitRepositoryToCreate.name,
          groupName: gitRepositoryToCreate.groupName,
          resources: {},
          gitOrganization: {
            connect: { id: gitRepositoryToCreate.gitOrganizationId },
          },
        },
      });

      gitRepository = {
        connect: { id: wizardGitRepository.id },
      };
    }

    if (
      isOnBoarding ||
      (!gitRepositoryToCreate?.isOverrideGitRepository &&
        !projectConfiguration.gitRepositoryId)
    ) {
      await this.prisma.resource.update({
        data: {
          gitRepository: gitRepository,
        },
        where: {
          id: projectConfiguration.id,
        },
      });
    }

    return await this.prisma.resource.create({
      data: {
        ...args.data,
        gitRepository: gitRepository,
        gitRepositoryOverride:
          gitRepositoryToCreate?.isOverrideGitRepository ?? false,
      },
    });
  }

  async updateCodeGeneratorVersion(
    args: UpdateCodeGeneratorVersionArgs,
    user: User
  ): Promise<Resource | null> {
    const resource = await this.resource({
      where: {
        id: args.where.id,
      },
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    const codeGeneratorUpdate = await this.billingService.getBooleanEntitlement(
      user.workspace.id,
      BillingFeature.CodeGeneratorVersion
    );

    if (codeGeneratorUpdate && !codeGeneratorUpdate.hasAccess)
      throw new AmplicationError(
        "Feature Unavailable. Please upgrade your plan to access this feature."
      );

    await this.analytics.track({
      userId: user.account.id,
      properties: {
        resourceId: resource.id,
        projectId: resource.projectId,
        workspaceId: user.workspace.id,
        $groups: { groupWorkspace: user.workspace.id },
      },
      event: EnumEventType.CodeGeneratorVersionUpdate,
    });

    return this.prisma.resource.update({
      where: args.where,
      data: {
        codeGeneratorVersion:
          args.data.codeGeneratorVersionOptions.codeGeneratorVersion,
        codeGeneratorStrategy:
          args.data.codeGeneratorVersionOptions.codeGeneratorStrategy,
      },
    });
  }

  /**
   * Create a resource of type "Message Broker" with a default topic
   */
  async createMessageBroker(
    args: CreateOneResourceArgs,
    user: User
  ): Promise<Resource> {
    const resource = await this.createResource(
      {
        data: {
          ...args.data,
          resourceType: EnumResourceType.MessageBroker,
        },
      },
      user
    );
    await this.topicService.createDefault(resource, user);

    return resource;
  }

  /**
   * Create a resource of type "Service", with the built-in "user" role
   */
  async createService(
    args: CreateOneResourceArgs,
    user: User,
    wizardType: string = null,
    requireAuthenticationEntity: boolean = null
  ): Promise<Resource> {
    const { serviceSettings, gitRepository, ...rest } = args.data;
    const resource = await this.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.Service,
        },
      },
      user,
      gitRepository,
      wizardType
    );

    await this.prisma.resourceRole.create({
      data: { ...USER_RESOURCE_ROLE, resourceId: resource.id },
    });

    if (requireAuthenticationEntity) {
      await this.entityService.createDefaultEntities(resource.id, user);
      serviceSettings.authEntityName = USER_ENTITY_NAME;
    }

    await this.serviceSettingsService.createDefaultServiceSettings(
      resource.id,
      user,
      serviceSettings
    );

    await this.environmentService.createDefaultEnvironment(resource.id);

    const project = await this.projectService.findUnique({
      where: { id: resource.projectId },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Services
    );

    return resource;
  }

  async createPreviewService({
    args,
    user,
    nonDefaultPluginsToInstall,
    requireAuthenticationEntity,
  }: CreatePreviewServiceArgs): Promise<Resource> {
    const { serviceSettings, gitRepository, ...rest } = args.data;
    const resource = await this.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.Service,
        },
      },
      user,
      gitRepository,
      "create resource"
    );

    await this.prisma.resourceRole.create({
      data: { ...USER_RESOURCE_ROLE, resourceId: resource.id },
    });

    if (requireAuthenticationEntity) {
      await this.entityService.createDefaultEntities(resource.id, user);
      serviceSettings.authEntityName = USER_ENTITY_NAME;
    }

    await this.serviceSettingsService.createDefaultServiceSettings(
      resource.id,
      user,
      serviceSettings
    );

    const plugins = [
      DEFAULT_DB_PLUGIN,
      ...(requireAuthenticationEntity ? DEFAULT_AUTH_PLUGINS : []),
      ...nonDefaultPluginsToInstall,
    ];

    await this.installPlugins(resource.id, plugins, user);

    await this.environmentService.createDefaultEnvironment(resource.id);

    const project = await this.projectService.findUnique({
      where: { id: resource.projectId },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Services
    );

    return resource;
  }

  async installPlugins(
    resourceId: string,
    plugins: PluginInstallationCreateInput[],
    user: User
  ): Promise<void> {
    for (const plugin of plugins) {
      plugin.resource = { connect: { id: resourceId } };
      const isvValidEntityUser = await this.userEntityValidation(
        resourceId,
        plugin.configurations
      );
      isvValidEntityUser &&
        (await this.pluginInstallationService.create({ data: plugin }, user));
    }
  }

  async redesignProject(
    args: RedesignProjectArgs,
    user: User
  ): Promise<UserAction> {
    const { movedEntities, newServices, projectId } = args.data;

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    const [firstResource] = await this.resources({
      where: { projectId: projectId },
    });

    const resourceId =
      movedEntities[0]?.originalResourceId ?? firstResource?.id;

    await this.analytics.track({
      userId: user.id,
      properties: {
        workspaceId: user.workspace?.id,
        projectId,
        resourceId: resourceId,
        plan: subscription.subscriptionPlan,
        movedEntities: movedEntities.length,
        newServices: newServices.length,
      },
      event: EnumEventType.ArchitectureRedesignApply,
    });

    const defaultServiceSettings: ServiceSettingsUpdateInput = {
      adminUISettings: {
        generateAdminUI: false,
        adminUIPath: "",
      },
      serverSettings: {
        generateGraphQL: true, //@todo: take value from original service
        generateRestApi: false, //@todo: take value from original service
        generateServer: true,
        serverPath: "", //@todo: take path from original service and use the same base path
      },
      authProvider: EnumAuthProviderType.Jwt,
    };

    const userAction =
      await this.userActionService.createUserActionByTypeWithInitialStep(
        EnumUserActionType.ProjectRedesign,
        undefined,
        REDESIGN_PROJECT_INITIAL_STEP_DATA,
        user.id,
        resourceId
      );

    const actionContext = this.actionService.createActionContext(
      userAction.id,
      userAction.action.steps[0],
      KAFKA_TOPICS.USER_ACTION_LOG_TOPIC
    );

    try {
      // 1. create new resources
      const projectGitRepository = await this.prisma.gitRepository.findFirst({
        where: {
          resources: {
            some: {
              id: projectId,
            },
          },
        },
        include: {
          resources: true,
        },
      });

      const newResourcesMap = new Map<string, Resource>();

      for (const newService of newServices) {
        const args: CreateOneResourceArgs = {
          data: {
            name: newService.name,
            description: "",
            project: {
              connect: {
                id: projectId,
              },
            },
            resourceType: EnumResourceType.Service,
            serviceSettings: defaultServiceSettings,
            gitRepository: projectGitRepository
              ? {
                  isOverrideGitRepository: false,
                  name: projectGitRepository?.name,
                  resourceId: "",
                  gitOrganizationId: projectGitRepository?.gitOrganizationId,
                }
              : null,
          },
        };

        const resource = await this.createService(args, user);
        await actionContext.onEmitUserActionLog(
          `Successfully created service ${resource.name} with id ${resource.id}`,
          EnumActionLogLevel.Info
        );

        newResourcesMap.set(newService.id, resource);

        await this.installPlugins(resource.id, [DEFAULT_DB_PLUGIN], user);
      }

      // 2. update resourceId in copied entities list
      for (const entityToCopy of movedEntities) {
        const newResource: Resource = newResourcesMap.get(
          entityToCopy.targetResourceId
        );

        if (newResource) {
          entityToCopy.targetResourceId = newResource.id;
        }
      }

      // 3.group moved entities by target resource
      const movedEntitiesByResource = movedEntities.reduce(
        (entitiesByResource, entity) => {
          if (!entitiesByResource[entity.targetResourceId]) {
            entitiesByResource[entity.targetResourceId] = [];
          }
          entitiesByResource[entity.targetResourceId].push(entity);
          return entitiesByResource;
        },
        {} as { [resourceId: string]: RedesignProjectMovedEntity[] }
      );

      const sourceEntityIdToNewEntityMap = new Map<
        string,
        CreateBulkEntitiesInput
      >();

      // 4. create entities per resource
      for (const [resourceId, entities] of Object.entries(
        movedEntitiesByResource
      )) {
        await actionContext.onEmitUserActionLog(
          `starting to move entities to resource ${resourceId}`,
          EnumActionLogLevel.Info
        );

        const createBulkData: CreateBulkEntitiesAndFieldsArgs = {
          resourceId: resourceId,
          preparedEntitiesWithFields: [],
          user: user,
        };

        //First create all entities, so we have the IDs for the relations
        for (const movedEntity of entities) {
          const entity = await this.entityService.entity({
            where: {
              id: movedEntity.entityId,
            },
          });

          const createEntityInput: CreateBulkEntitiesInput = {
            id: cuid(), // creating here the entity id because we need it for the relation
            name: entity.name,
            displayName: entity.displayName,
            pluralDisplayName: entity.pluralDisplayName,
            description: entity.description,
            customAttributes: entity.customAttributes,
            fields: [],
          };
          sourceEntityIdToNewEntityMap.set(entity.id, createEntityInput);
          createBulkData.preparedEntitiesWithFields.push(createEntityInput);
        }

        const lookupFieldsToSkip = new Set<string>();

        //run again on all entities to create the fields
        for (const movedEntity of entities) {
          const currentEntityCreateInput = sourceEntityIdToNewEntityMap.get(
            movedEntity.entityId
          );

          //get the list of fields of the source entity
          const fields = await this.entityService.getFields(
            movedEntity.entityId,
            {}
          );

          for (const field of fields) {
            await actionContext.onEmitUserActionLog(
              `Preparing data to move field ${field.name} to entity ${currentEntityCreateInput.name} `,
              EnumActionLogLevel.Info
            );

            const createFieldInput: CreateBulkFieldsInput = {
              permanentId: cuid(),
              name: field.name,
              displayName: field.displayName,
              dataType: field.dataType,
              required: field.required,
              unique: field.unique,
              searchable: field.searchable,
              description: field.description,
              properties: field.properties as JsonObject,
              customAttributes: field.customAttributes,
            };

            if (field.dataType === EnumDataType.Lookup) {
              const relatedEntityId = (field.properties as unknown as Lookup)
                .relatedEntityId;

              const fieldProperties = field.properties as unknown as Lookup;

              //If the related entity is moved to the SAME RESOURCE - we should keep the relation
              if (
                entities.find((entity) => entity.entityId === relatedEntityId)
              ) {
                if (lookupFieldsToSkip.has(field.permanentId)) {
                  //The other side of this relation field was already moved
                  continue;
                }

                const relatedField = await this.entityService.getField({
                  where: {
                    permanentId: fieldProperties.relatedFieldId,
                  },
                });

                await actionContext.onEmitUserActionLog(
                  `moving relation field ${field.name} to entity ${currentEntityCreateInput.name} - related field ${relatedField.name} is in the same resource`,
                  EnumActionLogLevel.Info
                );

                //@todo: what about the rest of the properties of the related field (like searchable, unique, required, description, customAttributes etc.)
                createFieldInput.relatedFieldName = relatedField.name;
                createFieldInput.relatedFieldDisplayName =
                  relatedField.displayName;
                createFieldInput.relatedFieldAllowMultipleSelection = (
                  relatedField.properties as unknown as Lookup
                ).allowMultipleSelection;

                (
                  createFieldInput.properties as unknown as Lookup
                ).relatedFieldId = undefined; //clear the related field id, because it will be set later

                (
                  createFieldInput.properties as unknown as Lookup
                ).relatedEntityId = sourceEntityIdToNewEntityMap.get(
                  fieldProperties.relatedEntityId
                ).id; //the new entity Id of the related entity

                lookupFieldsToSkip.add(relatedField.permanentId);
              } else {
                await actionContext.onEmitUserActionLog(
                  `moving relation field ${field.name} to resource ${resourceId} - related entity ${relatedEntityId} is in a different resource`,
                  EnumActionLogLevel.Info
                );

                //if the related entity is moved to a different resource - we should remove the relation
                if (!fieldProperties.allowMultipleSelection) {
                  createFieldInput.name = `${createFieldInput.name}Id`;
                  createFieldInput.displayName = `${createFieldInput.displayName} ID`;
                  createFieldInput.dataType =
                    await this.entityService.getRelatedFieldScalarTypeByRelatedEntityIdType(
                      relatedEntityId
                    );

                  createFieldInput.properties =
                    DATA_TYPE_TO_DEFAULT_PROPERTIES[createFieldInput.dataType];
                } else {
                  createFieldInput.dataType = EnumDataType.Json;
                  createFieldInput.properties =
                    DATA_TYPE_TO_DEFAULT_PROPERTIES[EnumDataType.Json]; //type Json does not have properties
                }
              }
            }
            currentEntityCreateInput.fields.push(createFieldInput);
          }
        }

        await this.entityService.createBulkEntitiesAndFields(
          createBulkData,
          actionContext
        );
      }

      // 3.delete entities from source services
      for (const entity of movedEntities) {
        await actionContext.onEmitUserActionLog(
          `deleting entity ${entity.entityId} from source service`,
          EnumActionLogLevel.Info
        );
        await this.entityService.deleteOneEntity(
          { where: { id: entity.entityId } },
          user,
          EnumRelatedFieldStrategy.UpdateToScalar
        );
      }
    } catch (error) {
      await actionContext.onEmitUserActionLog(
        error.message,
        EnumActionLogLevel.Error
      );

      await actionContext.onEmitUserActionLog(
        `Failed to move entities to new resources. See previous logs for more details`,
        EnumActionLogLevel.Error,
        EnumActionStepStatus.Failed,
        true
      );

      return userAction;
    }

    await actionContext.onEmitUserActionLog(
      `Successfully moved all entities to new resources`,
      EnumActionLogLevel.Info,
      EnumActionStepStatus.Success,
      true
    );

    return userAction;
  }

  async userEntityValidation(
    resourceId: string,
    configurations: JsonValue
  ): Promise<boolean> {
    try {
      const resource = await this.prisma.resource.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          entities: true,
        },
      });

      if (
        !resource.entities?.find(
          (entity) =>
            entity.name.toLowerCase() === USER_ENTITY_NAME.toLowerCase()
        ) &&
        configurations &&
        configurations["requireAuthenticationEntity"] === "true"
      ) {
        throw new ConflictException("Plugin must have an User entity");
      }
      return true;
    } catch (error) {
      this.logger.error(error.message, error);
      return false;
    }
  }

  /**
   * Create a resource of type "Service" with entities and fields in one transaction, based only on entities and fields names
   * @param user the user to associate the created resource with
   */
  async createServiceWithEntities(
    data: ResourceCreateWithEntitiesInput,
    user: User
  ): Promise<ResourceCreateWithEntitiesResult> {
    if (
      data.entities.find(
        (entity) => entity.name.toLowerCase() === USER_ENTITY_NAME.toLowerCase()
      )
    ) {
      throw new ReservedEntityNameError(USER_ENTITY_NAME);
    }

    const requireAuthenticationEntity =
      data.plugins?.plugins?.filter((plugin) => {
        return plugin.configurations["requireAuthenticationEntity"] === "true";
      }).length > 0;
    const project = await this.projectService.findUnique({
      where: { id: data.resource.project.connect.id },
    });

    if (data.connectToDemoRepo) {
      await this.projectService.createDemoRepo(
        data.resource.project.connect.id
      );
      //do not use any git data when using demo repo
      data.resource.gitRepository = undefined;

      await this.analytics.track({
        userId: user.account.id,
        event: EnumEventType.DemoRepoCreate,
        properties: {
          projectId: project.id,
          workspaceId: project.workspaceId,
          $groups: { groupWorkspace: project.workspaceId },
        },
      });
    }

    const resource = await this.createService(
      {
        data: data.resource,
      },
      user,
      data.wizardType,
      requireAuthenticationEntity
    );

    const newEntities: {
      [index: number]: { entityId: string; name: string };
    } = {};

    for (const { entity, index } of data.entities.map((entity, index) => ({
      index,
      entity,
    }))) {
      const displayName = entity.name.trim();

      const pluralDisplayName = pluralize(displayName);
      const singularDisplayName = pluralize.singular(displayName);
      const name = pascalCase(singularDisplayName);

      const newEntity = await this.entityService.createOneEntity(
        {
          data: {
            resource: {
              connect: {
                id: resource.id,
              },
            },
            displayName: displayName,
            name: name,
            pluralDisplayName: pluralDisplayName,
          },
        },
        user
      );

      newEntities[index] = {
        entityId: newEntity.id,
        name: newEntity.name,
      };

      for (const entityField of entity.fields) {
        await this.entityService.createFieldByDisplayName(
          {
            data: {
              entity: {
                connect: {
                  id: newEntity.id,
                },
              },
              displayName: entityField.name,
              dataType: entityField.dataType,
            },
          },
          user
        );
      }
    }

    //after all entities were created, create the relation fields
    for (const { entity, index } of data.entities.map((entity, index) => ({
      index,
      entity,
    }))) {
      if (entity.relationsToEntityIndex) {
        for (const relationToIndex of entity.relationsToEntityIndex) {
          await this.entityService.createFieldByDisplayName(
            {
              data: {
                entity: {
                  connect: {
                    id: newEntities[index].entityId,
                  },
                },
                displayName: newEntities[relationToIndex].name,
                dataType: EnumDataType.Lookup,
              },
            },
            user
          );
        }
      }
    }

    if (data.plugins?.plugins) {
      await this.installPlugins(resource.id, data.plugins.plugins, user);
    }

    const isOnboarding = data.wizardType.trim().toLowerCase() === "onboarding";
    if (isOnboarding) {
      try {
        await this.projectService.commit(
          {
            data: {
              message: INITIAL_COMMIT_MESSAGE,
              project: {
                connect: {
                  id: resource.projectId,
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          },
          user
        );
      } catch (error) {
        this.logger.error(error.message, error);
      }
    }

    const resourceBuilds = await this.prisma.resource.findUnique({
      where: { id: resource.id },
      select: {
        builds: true,
      },
    });

    const { gitRepository, serviceSettings } = data.resource;

    const gitOrganization = await this.gitOrganizationByResource({
      where: {
        id: resource.id,
      },
    });

    const provider = data.connectToDemoRepo
      ? "demo-repo"
      : gitRepository && gitOrganization.provider;

    const totalEntities = data.entities.length;
    const totalFields = data.entities.reduce((acc, entity) => {
      return acc + entity.fields.length;
    }, 0);

    await this.analytics.track({
      userId: user.account.id,
      event: EnumEventType.ServiceWizardServiceGenerated,
      properties: {
        category: "Service Wizard",
        wizardType: data.wizardType,
        resourceName: resource.name,
        gitProvider: provider,
        gitOrganizationName: gitOrganization?.name,
        repoName: gitRepository?.name,
        graphQlApi: String(serviceSettings.serverSettings.generateGraphQL),
        restApi: String(serviceSettings.serverSettings.generateRestApi),
        adminUI: String(serviceSettings.adminUISettings.generateAdminUI),
        repoType: data.repoType,
        dbType: data.dbType,
        auth: data.authType,
        projectId: project.id,
        workspaceId: project.workspaceId,
        totalEntities,
        totalFields,
        gitOrgType: gitOrganization?.type,
        $groups: { groupWorkspace: project.workspaceId },
      },
    });

    return {
      resource: resource,
      build: isOnboarding ? resourceBuilds.builds[0] : null,
    };
  }

  async resource(args: FindOneArgs): Promise<Resource | null> {
    return this.prisma.resource.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null,
        archived: { not: true },
      },
    });
  }

  async resources(args: FindManyResourceArgs): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
        archived: { not: true },
      },
    });
  }

  async resourcesByIds(
    args: FindManyResourceArgs,
    ids: string[]
  ): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      ...args,
      where: {
        ...args.where,
        id: { in: ids },
        deletedAt: null,
        archived: { not: true },
      },
    });
  }

  async messageBrokerConnectedServices(args: FindOneArgs): Promise<Resource[]> {
    const resource = await this.resource(args);
    const serviceTopicsCollection = await this.serviceTopicsService.findMany({
      where: { resource: { projectId: resource.projectId } },
    });
    const brokerServiceTopics = serviceTopicsCollection.filter(
      (x) => x.messageBrokerId === resource.id && x.enabled
    );

    const resources = this.resourcesByIds(
      {},
      brokerServiceTopics.map((x) => x.resourceId)
    );

    return resources;
  }

  private async deleteMessageBrokerReferences(
    resource: Resource,
    user: User
  ): Promise<void> {
    if (resource.resourceType !== "MessageBroker") {
      throw Error("Unsupported resource. Invalid resourceType");
    }

    const messageBrokerTopics = await this.topicService.findMany({
      where: {
        resource: {
          id: resource.id,
        },
      },
    });

    const deletedTopicsPromises = messageBrokerTopics.map((topic) => {
      return this.topicService.delete({ where: { id: topic.id } }, user);
    });

    const deletedTopics = await Promise.all(deletedTopicsPromises);
    this.logger.debug("Deleted topics for resource", {
      resource,
      deletedTopics,
    });

    const deleteServiceConnections =
      await this.serviceTopicsService.deleteServiceTopic(resource.id, user);
    this.logger.debug("Successfully deleted ServiceTopics", {
      deleteServiceConnections,
    });
  }

  async deleteResource(
    args: FindOneArgs,
    user: User
  ): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: args.where.id,
      },
      include: {
        gitRepository: true,
      },
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    switch (resource.resourceType) {
      case EnumResourceType.ProjectConfiguration:
        throw new Error(INVALID_DELETE_PROJECT_CONFIGURATION);
      case EnumResourceType.MessageBroker:
        await this.deleteMessageBrokerReferences(resource, user);
        break;
    }

    await this.prisma.resource.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(resource.name, resource.id),
        deletedAt: new Date(),
        gitRepository: {
          disconnect: true,
        },
      },
    });

    if (resource.resourceType === EnumResourceType.Service) {
      const project = await this.projectService.findUnique({
        where: { id: resource.projectId },
      });
      await this.billingService.reportUsage(
        project.workspaceId,
        BillingFeature.Services,
        -1
      );

      await this.subscriptionService.updateServiceLicensed(project.workspaceId);
    }

    if (!resource.gitRepositoryOverride) {
      return resource;
    }

    return this.deleteResourceGitRepository(resource);
  }

  async deleteResourceGitRepository(resource: Resource): Promise<Resource> {
    const gitRepo = await this.prisma.gitRepository.findFirst({
      where: {
        resources: { every: { id: resource.id } },
      },
    });

    if (!gitRepo) {
      await this.prisma.gitRepository.delete({
        where: {
          id: resource.gitRepositoryId,
        },
      });
    }

    return resource;
  }

  async updateResource(args: UpdateOneResourceArgs): Promise<Resource | null> {
    const resource = await this.resource({
      where: {
        id: args.where.id,
      },
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    if (resource.resourceType === EnumResourceType.ProjectConfiguration) {
      await this.projectService.updateProject({
        data: { name: args.data.name },
        where: { id: resource.projectId },
      });
    }

    return this.prisma.resource.update(args);
  }

  async reportSyncMessage(
    resourceId: string,
    message: string
  ): Promise<Resource> {
    const resource = await this.resource({
      where: {
        id: resourceId,
      },
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: {
        githubLastMessage: message,
        githubLastSync: new Date(),
      },
    });
  }

  async gitRepository(resourceId: string): Promise<GitRepository | null> {
    if (!resourceId) return;
    return (
      await this.prisma.resource.findUnique({
        where: { id: resourceId },
        include: { gitRepository: { include: { gitOrganization: true } } },
      })
    ).gitRepository;
  }

  async gitOrganizationByResource(
    args: FindOneArgs
  ): Promise<GitOrganization | null> {
    return (
      await this.prisma.resource.findUnique({
        ...args,
        include: { gitRepository: { include: { gitOrganization: true } } },
      })
    ).gitRepository?.gitOrganization;
  }

  async project(resourceId: string): Promise<Project> {
    return this.projectService.findFirst({
      where: { resources: { some: { id: resourceId } } },
    });
  }

  async projectConfiguration(projectId: string): Promise<Resource | null> {
    return await this.prisma.resource.findFirst({
      where: {
        resourceType: EnumResourceType.ProjectConfiguration,
        project: { id: projectId },
      },
      include: {
        gitRepository: true,
      },
    });
  }

  async getResourceWorkspace(resourceId: string) {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
      include: {
        project: {
          include: {
            workspace: true,
          },
        },
      },
    });
    return resource.project.workspace;
  }

  /**
   *  Archives all resources of a project when a project is archived or deleted.
   *
   * @param id Project's unique identifier
   * @returns List of archived resources
   */
  async archiveProjectResources(id: string): Promise<Resource[]> {
    const { resources } = await this.projectService.findUnique({
      where: { id },
      include: {
        resources: {
          where: { deletedAt: null, archived: { not: true } },
        },
      },
    } as FindOneArgs);

    for (const resource of resources) {
      if (isEmpty(resource)) {
        throw new Error(INVALID_RESOURCE_ID);
      }
    }

    const archiveResources = resources.map((resource) =>
      this.prisma.resource.update({
        where: { id: resource.id },
        data: {
          name: prepareDeletedItemName(resource.name, resource.id),
          archived: true,
        },
      })
    );

    return this.prisma.$transaction(archiveResources);
  }
}
