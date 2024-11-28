import {
  EnumActionStepStatus,
  RedesignProjectMovedEntity,
  RedesignProjectNewService,
  types,
} from "@amplication/code-gen-types";

import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import cuid from "cuid";
import { isEmpty, kebabCase } from "lodash";
import { pascalCase } from "pascal-case";
import pluralize from "pluralize";
import { JsonObject } from "type-fest";
import { FindOneArgs } from "../../dto";
import { EnumDataType } from "../../enums/EnumDataType";
import { QueryMode } from "../../enums/QueryMode";
import { AmplicationError } from "../../errors/AmplicationError";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { Entity, GitOrganization, Project, Resource, User } from "../../models";
import {
  EnumResourceType,
  GitRepository,
  Prisma,
  PrismaService,
} from "../../prisma";
import { EnumResourceType as AmplicationEnumResourceType } from "../resource/dto/EnumResourceType";

import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { ActionService } from "../action/action.service";
import { EnumActionLogLevel } from "../action/dto/EnumActionLogLevel";
import { BillingService } from "../billing/billing.service";
import {
  DATA_TYPE_TO_DEFAULT_PROPERTIES,
  USER_ENTITY_NAME,
} from "../entity/constants";
import { EnumRelatedFieldStrategy } from "../entity/dto/EnumRelatedFieldStrategy";
import {
  CreateBulkEntitiesAndFieldsArgs,
  CreateBulkEntitiesInput,
  CreateBulkFieldsInput,
  EntityService,
} from "../entity/entity.service";
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

import { jsonPathStringFilterToPrismaFilter } from "../../prisma/JsonPathStringFilterToPrismaFilter";
import { GitConnectionSettings } from "../git/dto/objects/GitConnectionSettings";
import { GitProviderService } from "../git/git.provider.service";
import { EnumOwnershipType, Ownership } from "../ownership/dto/Ownership";
import { OwnershipService } from "../ownership/ownership.service";
import { ServiceTemplateVersion } from "../serviceSettings/dto/ServiceTemplateVersion";
import { TemplateCodeEngineVersionService } from "../templateCodeEngineVersion/templateCodeEngineVersion.service";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { EnumResourceTypeGroup } from "./dto/EnumResourceTypeGroup";
import { RelationService } from "../relation/relation.service";
import { PaginatedResourceQueryResult } from "../../dto/PaginatedQueryResult";
import { ResourceInclude } from "./dto/ResourceInclude";

const USER_RESOURCE_ROLE = {
  name: "user",
  displayName: "User",
};

export const DEFAULT_ENVIRONMENT_NAME = "Sandbox environment";
export const INITIAL_COMMIT_MESSAGE = "Initial Commit";

export const INVALID_RESOURCE_ID = "Invalid resourceId";
export const INVALID_DELETE_PROJECT_CONFIGURATION =
  "The resource of type `ProjectConfiguration` cannot be deleted";

const SERVICE_LIMITATION_ERROR =
  "Can not create new services, The workspace reached your plan's resource limitation";

const DEFAULT_NODEJS_DB_PLUGIN: PluginInstallationCreateInput = {
  pluginId: "db-postgres",
  enabled: true,
  npm: "@amplication/plugin-db-postgres",
  version: "latest",
  displayName: "db-postgres",
  resource: undefined,
  isPrivate: false,
};

const DEFAULT_DOTNET_DB_PLUGIN: PluginInstallationCreateInput = {
  pluginId: "dotnet-db-sqlserver",
  enabled: true,
  npm: "@amplication/plugin-dotnet-db-sqlserver",
  version: "latest",
  displayName: "dotnet-db-sqlserver",
  resource: undefined,
  isPrivate: false,
};

const DEFAULT_AUTH_PLUGINS: PluginInstallationCreateInput[] = [
  {
    displayName: "Auth-core",
    pluginId: "auth-core",
    npm: "@amplication/plugin-auth-core",
    version: "latest",
    enabled: true,
    resource: undefined,
    isPrivate: false,
  },
  {
    displayName: "Auth-jwt",
    pluginId: "auth-jwt",
    npm: "@amplication/plugin-auth-jwt",
    version: "latest",
    enabled: true,
    resource: undefined,
    isPrivate: false,
  },
];

const RESOURCE_TYPE_TO_EVENT_TYPE: {
  [key in EnumResourceType]: EnumEventType;
} = {
  [EnumResourceType.Service]: EnumEventType.ServiceCreate,
  [EnumResourceType.MessageBroker]: EnumEventType.MessageBrokerCreate,
  [EnumResourceType.ProjectConfiguration]: EnumEventType.UnknownEvent,
  [EnumResourceType.PluginRepository]: EnumEventType.PluginRepositoryCreate,
  [EnumResourceType.ServiceTemplate]: EnumEventType.ServiceTemplateCreate,
  [EnumResourceType.Component]: EnumEventType.ComponentCreate,
};

type CodeGeneratorName = "NodeJS" | "DotNET" | "Blueprint";

const CODE_GENERATOR_ENUM_TO_NAME_AND_LICENSE: {
  [key in EnumCodeGenerator]: {
    codeGeneratorName: CodeGeneratorName;
    license: BillingFeature;
  };
} = {
  [EnumCodeGenerator.DotNet]: {
    codeGeneratorName: "DotNET",
    license: BillingFeature.CodeGeneratorDotNet,
  },
  [EnumCodeGenerator.NodeJs]: { codeGeneratorName: null, license: null },
  [EnumCodeGenerator.Blueprint]: {
    codeGeneratorName: "Blueprint",
    license: null,
  },
};

export const CODE_GENERATOR_NAME_TO_ENUM: {
  [key in CodeGeneratorName]: EnumCodeGenerator;
} = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NodeJS: EnumCodeGenerator.NodeJs,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DotNET: EnumCodeGenerator.DotNet,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Blueprint: EnumCodeGenerator.Blueprint,
};

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger,
    private entityService: EntityService,
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
    private readonly userActionService: UserActionService,
    private readonly gitProviderService: GitProviderService,
    private readonly templateCodeEngineVersionService: TemplateCodeEngineVersionService,
    private readonly ownershipService: OwnershipService,
    private readonly relationService: RelationService
  ) {}

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
        description: "", // mandatory field
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
  async createResource(
    args: CreateOneResourceArgs,
    user: User,
    updateProjectGitRepository = false
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

      const existingProjectResources = await this.resources({
        where: {
          project: { id: args.data.project.connect.id },
          resourceType: { equals: AmplicationEnumResourceType.Service },
        },
      });

      if (
        serviceEntitlement &&
        existingProjectResources &&
        existingProjectResources.length >= serviceEntitlement.usageLimit
      ) {
        const message = `You have reached the maximum number of services allowed. To continue using additional services, please upgrade your plan.`;
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

    let gitRepositoryConnect:
      | Prisma.GitRepositoryCreateNestedOneWithoutResourcesInput
      | undefined = undefined;

    const { gitRepository } = args.data;
    let overrideGitRepository = false;

    if (!projectConfiguration.gitRepositoryId) {
      updateProjectGitRepository = true;
    }

    //when requested, create a new git repository and connect to the resource, otherwise inherit the project's git repository
    if (
      gitRepository &&
      (gitRepository.isOverrideGitRepository || updateProjectGitRepository) && //only when requested to override
      gitRepository.gitOrganizationId && //and the data is provided
      gitRepository.name
    ) {
      overrideGitRepository = gitRepository.isOverrideGitRepository;
      const newGitRepository = await this.prisma.gitRepository.create({
        data: {
          name: gitRepository.name,
          groupName: gitRepository.groupName,
          resources: {},
          gitOrganization: {
            connect: { id: gitRepository.gitOrganizationId },
          },
        },
      });

      gitRepositoryConnect = {
        connect: { id: newGitRepository.id },
      };

      if (updateProjectGitRepository) {
        await this.prisma.resource.update({
          data: {
            gitRepository: gitRepositoryConnect,
          },
          where: {
            id: projectConfiguration.id,
          },
        });
      }
    } else if (projectConfiguration.gitRepositoryId) {
      overrideGitRepository = false;

      gitRepositoryConnect = {
        connect: { id: projectConfiguration.gitRepositoryId },
      };
    }

    const { codeGenerator, ...rest } = args.data;

    const resource = await this.prisma.resource.create({
      data: {
        ...rest,
        codeGeneratorName: await this.getAndValidateCodeGeneratorName(
          codeGenerator,
          user
        ),
        gitRepository: gitRepositoryConnect,
        gitRepositoryOverride: overrideGitRepository,
      },
    });

    const eventName = RESOURCE_TYPE_TO_EVENT_TYPE[args.data.resourceType];

    await this.analytics.trackWithContext({
      properties: {
        resourceId: resource.id,
        projectId: args.data.project.connect.id,
        name: args.data.name,
      },
      event: eventName,
    });

    return resource;
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

    await this.analytics.trackWithContext({
      properties: {
        resourceId: resource.id,
        projectId: resource.projectId,
      },
      event: EnumEventType.CodeGeneratorVersionUpdate,
    });

    const updatedResource = await this.prisma.resource.update({
      where: args.where,
      data: {
        codeGeneratorVersion:
          args.data.codeGeneratorVersionOptions.codeGeneratorVersion,
        codeGeneratorStrategy:
          args.data.codeGeneratorVersionOptions.codeGeneratorStrategy,
      },
    });

    //update the template code engine version, to keep history of the code engine used in each version of the template
    if (resource.resourceType === EnumResourceType.ServiceTemplate) {
      await this.templateCodeEngineVersionService.update(
        resource.id,
        args.data.codeGeneratorVersionOptions.codeGeneratorVersion,
        args.data.codeGeneratorVersionOptions.codeGeneratorStrategy,
        user
      );
    }
    return updatedResource;
  }

  async getAndValidateCodeGeneratorName(
    codeGenerator: keyof typeof EnumCodeGenerator,
    user: User
  ): Promise<string | null> {
    if (!codeGenerator) return null;

    const blockEntitlement = await this.billingService.getBooleanEntitlement(
      user.workspace.id,
      BillingFeature.CodeGeneratorNodeJsOnly
    );

    if (blockEntitlement && blockEntitlement.hasAccess) {
      if (codeGenerator !== EnumCodeGenerator.NodeJs) {
        throw new AmplicationError(
          `Feature Unavailable. Please upgrade your plan to use the code generator for ${codeGenerator}.`
        );
      }
    }

    const { codeGeneratorName, license } =
      CODE_GENERATOR_ENUM_TO_NAME_AND_LICENSE[codeGenerator];

    if (license) {
      const entitlement = await this.billingService.getBooleanEntitlement(
        user.workspace.id,
        license
      );

      if (entitlement && !entitlement.hasAccess)
        throw new AmplicationError(
          `Feature Unavailable. Please upgrade your plan to use the code generator for ${codeGenerator}.`
        );
    }

    return codeGeneratorName;
  }

  //returns the default code generator name for the user
  //if the user has access to the .NET code generator, it will return it
  //otherwise, it will return the Node.js code generator
  async getDefaultCodeGenerator(user: User): Promise<EnumCodeGenerator | null> {
    const blockEntitlement = await this.billingService.getBooleanEntitlement(
      user.workspace.id,
      BillingFeature.CodeGeneratorNodeJsOnly
    );

    if (blockEntitlement && blockEntitlement.hasAccess) {
      return EnumCodeGenerator.NodeJs;
    }

    const { license } =
      CODE_GENERATOR_ENUM_TO_NAME_AND_LICENSE[EnumCodeGenerator.DotNet];

    if (license) {
      const entitlement = await this.billingService.getBooleanEntitlement(
        user.workspace.id,
        license
      );

      if (entitlement && entitlement.hasAccess) {
        return EnumCodeGenerator.DotNet;
      }
    }
    return EnumCodeGenerator.NodeJs;
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
   * Create a resource of type "PluginRepository"
   */
  async createPluginRepository(
    args: CreateOneResourceArgs,
    user: User
  ): Promise<Resource> {
    const existingResource = await this.resources({
      where: {
        project: { id: args.data.project.connect.id },
        resourceType: {
          equals: AmplicationEnumResourceType.PluginRepository,
        },
      },
    });

    if (existingResource && existingResource.length > 0) {
      return existingResource[0];
    }

    const resource = await this.createResource(
      {
        data: {
          ...args.data,
          resourceType: EnumResourceType.PluginRepository,
        },
      },
      user
    );

    return resource;
  }

  /**
   * Create a resource of type "Component"
   */
  async createComponent(
    args: CreateOneResourceArgs,
    user: User
  ): Promise<Resource> {
    if (!args.data.blueprint) {
      throw new AmplicationError("Component must use a blueprint");
    }

    const resource = await this.createResource(
      {
        data: {
          ...args.data,
          resourceType: EnumResourceType.Component,
          codeGenerator: EnumCodeGenerator.Blueprint,
        },
      },
      user
    );

    return resource;
  }

  /**
   * Create a resource of type "Service", with the built-in "user" role
   */
  async createService(
    args: CreateOneResourceArgs,
    user: User,
    updateProjectGitRepository = false,
    requireAuthenticationEntity: boolean = null
  ): Promise<Resource> {
    const { serviceSettings, ...rest } = args.data;
    const resource = await this.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.Service,
        },
      },
      user,
      updateProjectGitRepository
    );

    await this.createServiceDefaultObjects(
      resource,
      user,
      requireAuthenticationEntity,
      serviceSettings
    );

    const project = await this.projectService.findUnique({
      where: { id: resource.projectId },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Services
    );

    return resource;
  }

  async createServiceDefaultObjects(
    service: Resource,
    user: User,
    requireAuthenticationEntity: boolean,
    serviceSettings: ServiceSettingsUpdateInput = null
  ) {
    await this.prisma.resourceRole.create({
      data: { ...USER_RESOURCE_ROLE, resourceId: service.id },
    });

    if (requireAuthenticationEntity) {
      const [userEntity] = await this.entityService.createDefaultUserEntity(
        service.id,
        user
      );
      serviceSettings.authEntityName = userEntity.name;
    }

    await this.serviceSettingsService.createDefaultServiceSettings(
      service.id,
      user,
      serviceSettings
    );
  }

  async createDefaultAuthEntity(
    resourceId: string,
    user: User
  ): Promise<Entity> {
    const serviceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: {
            id: resourceId,
          },
        },
        user
      );

    if (!isEmpty(serviceSettings.authEntityName)) {
      throw new AmplicationError(
        `Auth entity already exists for resource "${resourceId} `
      );
    }

    const existingUserEntity = await this.entityService.entities({
      where: {
        resourceId: resourceId,
        name: USER_ENTITY_NAME,
      },
    });

    if (!isEmpty(existingUserEntity)) {
      throw new AmplicationError(
        `An entity with the default Auth entity name already exists for resource "${resourceId} `
      );
    }

    const [userEntity] = await this.entityService.createDefaultUserEntity(
      resourceId,
      user
    );

    await this.serviceSettingsService.updateServiceSettings(
      {
        data: {
          ...serviceSettings,
          authEntityName: userEntity.displayName,
        },
        where: {
          id: resourceId,
        },
      },
      user
    );

    return userEntity;
  }

  async createPreviewService(
    args: CreateOneResourceArgs,
    user: User,
    nonDefaultPluginsToInstall: PluginInstallationCreateInput[],
    requireAuthenticationEntity: boolean
  ): Promise<Resource> {
    const { serviceSettings, ...rest } = args.data;
    const resource = await this.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.Service,
        },
      },
      user
    );

    await this.prisma.resourceRole.create({
      data: { ...USER_RESOURCE_ROLE, resourceId: resource.id },
    });

    if (requireAuthenticationEntity) {
      const [userEntity] = await this.entityService.createDefaultUserEntity(
        resource.id,
        user
      );
      serviceSettings.authEntityName = userEntity.name;
    }

    await this.serviceSettingsService.createDefaultServiceSettings(
      resource.id,
      user,
      serviceSettings
    );

    const plugins = [
      DEFAULT_NODEJS_DB_PLUGIN,
      ...(requireAuthenticationEntity ? DEFAULT_AUTH_PLUGINS : []),
      ...nonDefaultPluginsToInstall,
    ];

    await this.installPlugins(resource.id, plugins, user);

    const project = await this.projectService.findUnique({
      where: { id: resource.projectId },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Services
    );

    return resource;
  }

  private createMovedEntitiesByResourceMapping(movedEntities): {
    [resourceId: string]: RedesignProjectMovedEntity[];
  } {
    return movedEntities.reduce((entitiesByResource, entity) => {
      if (!entitiesByResource[entity.targetResourceId]) {
        entitiesByResource[entity.targetResourceId] = [];
      }
      entitiesByResource[entity.targetResourceId].push(entity);
      return entitiesByResource;
    }, {} as { [resourceId: string]: RedesignProjectMovedEntity[] });
  }

  async installPlugins(
    resourceId: string,
    plugins: PluginInstallationCreateInput[],
    user: User
  ): Promise<void> {
    for (const plugin of plugins) {
      plugin.resource = { connect: { id: resourceId } };

      await this.pluginInstallationService.create({ data: plugin }, user);
    }
  }

  async createServiceWithDefaultSettings(
    serviceName: string,
    serviceDescription: string,
    projectId: string,
    user: User,
    installDefaultDbPlugin = true,
    codeGenerator: keyof typeof EnumCodeGenerator | null = null
  ): Promise<Resource> {
    const pathBase = `apps/${kebabCase(serviceName)}`;

    const adminUIPath = `${pathBase}-admin`;
    const serverPath = `${pathBase}-server`;

    const actualCodeGenerator =
      codeGenerator || (await this.getDefaultCodeGenerator(user));

    const args: CreateOneResourceArgs = {
      data: {
        name: serviceName,
        description: serviceDescription || "",
        project: {
          connect: {
            id: projectId,
          },
        },
        codeGenerator: actualCodeGenerator,
        resourceType: EnumResourceType.Service,
        serviceSettings: {
          adminUISettings: {
            adminUIPath: adminUIPath,
            generateAdminUI: actualCodeGenerator === EnumCodeGenerator.NodeJs,
          },
          serverSettings: {
            serverPath: serverPath,
            generateGraphQL: actualCodeGenerator === EnumCodeGenerator.NodeJs,
            generateRestApi: true,
            generateServer: true,
          },
          authProvider: EnumAuthProviderType.Jwt, //@todo: remove this property
        },

        gitRepository: null,
      },
    };

    const resource = await this.createService(args, user);

    if (installDefaultDbPlugin) {
      const defaultDbPlugin =
        actualCodeGenerator === EnumCodeGenerator.NodeJs
          ? DEFAULT_NODEJS_DB_PLUGIN
          : DEFAULT_DOTNET_DB_PLUGIN;
      await this.installPlugins(resource.id, [defaultDbPlugin], user);
    }

    return resource;
  }

  async redesignProject(
    args: RedesignProjectArgs,
    user: User
  ): Promise<UserAction> {
    const { movedEntities, newServices, projectId } = args.data;

    const [firstResource] = await this.resources({
      where: { projectId: projectId },
    });

    const project = await this.projectService.findUnique({
      where: {
        id: projectId,
      },
    });

    //group moved entities by target resource

    let movedEntitiesByResource =
      this.createMovedEntitiesByResourceMapping(movedEntities);

    const resourceId =
      movedEntities[0]?.originalResourceId ?? firstResource?.id;

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

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        projectId,
        resourceId,
        plan: subscription.subscriptionPlan,
        movedEntities: movedEntities.length,
        newServices: newServices.length,
      },
      event: EnumEventType.ArchitectureRedesignApply,
    });

    const originalResourceId = movedEntities[0]?.originalResourceId;

    const originalResourceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: {
            id: originalResourceId,
          },
        },
        user
      );

    const originalResourceAdminPath =
      originalResourceSettings &&
      originalResourceSettings.adminUISettings.adminUIPath;
    const originalResourceServerPath =
      originalResourceSettings &&
      originalResourceSettings.serverSettings.serverPath;

    const defaultServiceSettings: ServiceSettingsUpdateInput = {
      adminUISettings: {
        generateAdminUI: true,
        adminUIPath: "",
      },
      serverSettings: {
        generateGraphQL: true,
        generateRestApi: true,
        generateServer: true,
        serverPath: "",
      },
      authProvider: EnumAuthProviderType.Jwt,
    };

    try {
      // 1. data validationStep before starting the process
      await actionContext.onEmitUserActionLog(
        `Starting data validation`,
        EnumActionLogLevel.Info
      );

      await this.validateNewResourcesData(newServices, project);
      await this.validateMovedEntitiesData(
        movedEntitiesByResource,
        newServices,
        project,
        resourceId,
        user
      );

      await actionContext.onEmitUserActionLog(
        `Data validation ended Successfully`,
        EnumActionLogLevel.Info
      );

      // 2. create new resources
      const newResourcesMap = new Map<string, Resource>();

      for (const newService of newServices) {
        const adminPathWithoutLastFolder = originalResourceAdminPath?.substring(
          0,
          originalResourceAdminPath.lastIndexOf("/") + 1
        );

        const serverPathWithoutLastFolder =
          originalResourceServerPath?.substring(
            0,
            originalResourceServerPath.lastIndexOf("/") + 1
          );

        const baseAdminPath =
          !originalResourceId || !originalResourceAdminPath
            ? ""
            : !originalResourceAdminPath.includes("/")
            ? `${newService.name}-admin`
            : `${adminPathWithoutLastFolder}${newService.name}-admin`;
        const baseServerPath =
          !originalResourceId || !originalResourceServerPath
            ? ""
            : !originalResourceServerPath.includes("/")
            ? newService.name
            : `${serverPathWithoutLastFolder}${newService.name}`;

        const codeGenerator = await this.getDefaultCodeGenerator(user);

        const args: CreateOneResourceArgs = {
          data: {
            name: newService.name,
            description: "",
            project: {
              connect: {
                id: projectId,
              },
            },
            codeGenerator,
            resourceType: EnumResourceType.Service,
            serviceSettings: {
              ...defaultServiceSettings,

              adminUISettings: {
                adminUIPath: baseAdminPath,
                generateAdminUI:
                  defaultServiceSettings.adminUISettings.generateAdminUI,
              },
              serverSettings: {
                serverPath: baseServerPath,
                generateGraphQL:
                  defaultServiceSettings.serverSettings.generateGraphQL,
                generateRestApi:
                  defaultServiceSettings.serverSettings.generateRestApi,
                generateServer:
                  defaultServiceSettings.serverSettings.generateServer,
              },
            },

            gitRepository: null,
          },
        };

        const resource = await this.createService(args, user);
        await actionContext.onEmitUserActionLog(
          `Successfully created service ${resource.name} with id ${resource.id}`,
          EnumActionLogLevel.Info
        );

        newResourcesMap.set(newService.id, resource);

        const defaultDbPlugin =
          codeGenerator === EnumCodeGenerator.NodeJs
            ? DEFAULT_NODEJS_DB_PLUGIN
            : DEFAULT_DOTNET_DB_PLUGIN;
        await this.installPlugins(resource.id, [defaultDbPlugin], user);
      }

      // 3. update resourceId in copied entities list
      for (const entityToCopy of movedEntities) {
        const newResource: Resource = newResourcesMap.get(
          entityToCopy.targetResourceId
        );

        if (newResource) {
          entityToCopy.targetResourceId = newResource.id;
        }
      }

      // re-update movedEntitiesByResource after all new services were created, and the targetResourceId was updated to a real resourceId
      movedEntitiesByResource =
        this.createMovedEntitiesByResourceMapping(movedEntities);

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
              const relatedEntityId = (
                field.properties as unknown as types.Lookup
              ).relatedEntityId;

              const fieldProperties =
                field.properties as unknown as types.Lookup;

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
                  relatedField.properties as unknown as types.Lookup
                ).allowMultipleSelection;

                (
                  createFieldInput.properties as unknown as types.Lookup
                ).relatedFieldId = undefined; //clear the related field id, because it will be set later

                (
                  createFieldInput.properties as unknown as types.Lookup
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

  private async validateNewResourcesData(
    newServices: RedesignProjectNewService[],
    project: Project
  ): Promise<void> {
    const projectResources = await this.prisma.resource.findMany({
      where: {
        projectId: project.id,
        resourceType: EnumResourceType.Service,
        deletedAt: null,
      },
    });

    //service limitation validation
    const featureServices = await this.billingService.getMeteredEntitlement(
      project.workspaceId,
      BillingFeature.Services
    );

    if (newServices.length > 0) {
      if (
        !featureServices.hasAccess ||
        (!featureServices.isUnlimited &&
          featureServices.usageLimit <
            projectResources.length + newServices.length)
      ) {
        throw new AmplicationError(SERVICE_LIMITATION_ERROR);
      }
    }

    if (projectResources.length > 0) {
      for (const newService of newServices) {
        // duplicate name validation
        const duplicateService = projectResources.find(
          (resource) =>
            resource.name.toLocaleLowerCase() ===
            newService.name.toLocaleLowerCase()
        );
        if (duplicateService) {
          throw new AmplicationError(
            `Resource : ${newService.name} already exists in project: ${project.name}.`
          );
        }
      }
    }
  }
  private async validateMovedEntitiesData(
    movedEntitiesByResource: {
      [resourceId: string]: RedesignProjectMovedEntity[];
    },
    newServices: RedesignProjectNewService[],
    project: Project,
    originalResourceId: string,
    user: User
  ): Promise<void> {
    // entities limitation per service validation
    const featureEntitiesServices =
      await this.billingService.getNumericEntitlement(
        project.workspaceId,
        BillingFeature.EntitiesPerService
      );

    const serviceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: { id: originalResourceId },
        },
        user
      );

    for (const [resourceId, entities] of Object.entries(
      movedEntitiesByResource
    )) {
      let newService: RedesignProjectNewService = null;

      if (newServices.length > 0) {
        newService = newServices.find(
          (newService) => newService.id === resourceId
        );
      }

      const resourceEntities: Entity[] = await this.entityService.entities({
        where: {
          resourceId: resourceId,
          deletedAt: null,
        },
      });

      //pass limitation validation
      const currentResource = await this.resource({
        where: {
          id: resourceId,
        },
      });
      const serviceName = currentResource
        ? currentResource.name
        : newService.name;

      const entitiesCount = !currentResource
        ? entities.length
        : entities.length + resourceEntities?.length;
      if (!project.licensed || (currentResource && !currentResource.licensed)) {
        throw new AmplicationError(
          `Cannot move entities to service: ${serviceName} due to your plan's limitations (number of services)`
        );
      }

      if (
        !featureEntitiesServices.hasAccess ||
        featureEntitiesServices.value < entitiesCount
      ) {
        throw new AmplicationError(
          `Cannot move entities to service: ${serviceName} due to your plan's limitations (number of entities)`
        );
      }

      for (const movedEntity of entities) {
        const currentEntity = await this.entityService.entity({
          where: {
            id: movedEntity.entityId,
          },
        });
        // authEntity validation
        if (
          serviceSettings.authEntityName &&
          serviceSettings.authEntityName === currentEntity.name
        ) {
          throw new AmplicationError(
            `Cannot move Auth entity : ${currentEntity.name}.`
          );
        }

        //duplicate entities names validation
        if (resourceEntities.length > 0) {
          const duplicateEntity = resourceEntities.find(
            (e) => e.name === currentEntity.name
          );
          if (duplicateEntity) {
            throw new AmplicationError(
              `Entity : ${currentEntity.name} already exists in resource: ${serviceName}.`
            );
          }
        }
      }
    }
  }

  async getAuthEntityName(resourceId: string, user: User): Promise<string> {
    const serviceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: { id: resourceId },
        },
        user
      );
    return serviceSettings.authEntityName;
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

    const projectId = data.resource.project.connect.id;

    const isOnboarding = data.wizardType.trim().toLowerCase() === "onboarding";

    if (data.connectToDemoRepo) {
      await this.projectService.createDemoRepo(projectId, user);
      //do not use any git data when using demo repo
      data.resource.gitRepository = undefined;
    }

    const resource = await this.createService(
      {
        data: data.resource,
      },
      user,
      isOnboarding, //update project git repository only for onboarding
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

    if (isOnboarding) {
      try {
        await this.projectService.commit(
          {
            data: {
              resourceTypeGroup: EnumResourceTypeGroup.Services,
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
      : gitRepository && gitOrganization?.provider;

    const totalEntities = data.entities.length;
    const totalFields = data.entities.reduce((acc, entity) => {
      return acc + entity.fields.length;
    }, 0);

    await this.analytics.trackWithContext({
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
        projectId,
        totalEntities,
        totalFields,
        gitOrgType: gitOrganization?.type,
      },
    });

    return {
      resource: resource,
      build: isOnboarding ? resourceBuilds.builds[0] : null,
    };
  }

  async resource(
    args: FindOneArgs,
    include?: ResourceInclude | undefined
  ): Promise<Resource | null> {
    return this.prisma.resource.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null,
        archived: { not: true },
      },
      include,
    });
  }

  private async prepareResourceFindManyArgsForQuery(
    args: FindManyResourceArgs
  ): Promise<Prisma.ResourceFindManyArgs> {
    const { serviceTemplateId, ...where } = args.where;

    let resourceIds: string[] = undefined;
    if (serviceTemplateId) {
      const workspaceId = args.where?.project?.workspace?.id;
      if (!workspaceId) {
        //workspace.id is expected to be injected in the resolver middleware. It may be missing in internal calls
        throw new Error(
          "project.workspace.id is required when searching by serviceTemplateId"
        );
      }

      resourceIds = await this.serviceSettingsService.getServiceIdsByTemplateId(
        workspaceId,
        serviceTemplateId
      );
    }

    const { properties: whereProperties, ...whereElse } = where;
    const wherePropertiesFilter = jsonPathStringFilterToPrismaFilter(
      whereProperties,
      "properties"
    );

    return {
      ...args,
      where: {
        ...(whereElse as Prisma.ResourceWhereInput),
        id: resourceIds ? { in: resourceIds } : where.id,
        deletedAt: null,
        archived: { not: true },
        ...wherePropertiesFilter,
      },
    };
  }

  async searchResourcesWithCount(
    args: FindManyResourceArgs
  ): Promise<PaginatedResourceQueryResult> {
    const preparedArgs = await this.prepareResourceFindManyArgsForQuery(args);

    const [count, resources] = await Promise.all([
      this.prisma.resource.count({
        where: preparedArgs.where,
      }),

      this.prisma.resource.findMany(preparedArgs),
    ]);

    return {
      totalCount: count,
      data: resources,
    };
  }

  async resources(args: FindManyResourceArgs): Promise<Resource[]> {
    const preparedArgs = await this.prepareResourceFindManyArgsForQuery(args);

    return this.prisma.resource.findMany(preparedArgs);
  }

  async resourcesByIds(ids: string[]): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      where: {
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

  async gitRepository(resourceId: string) {
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

  async getPluginRepositoryGitSettingsByResource(
    resourceId: string
  ): Promise<GitConnectionSettings> {
    const resource = await this.resource({
      where: { id: resourceId },
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    const pluginRepositoryResourceList = await this.resources({
      where: {
        projectId: resource.projectId,
        resourceType: {
          equals: AmplicationEnumResourceType.PluginRepository,
        },
      },
    });

    if (pluginRepositoryResourceList.length === 0) {
      throw new Error("Plugin repository resource not found in the project");
    }

    if (pluginRepositoryResourceList.length > 1) {
      throw new Error("Multiple plugin repositories found in the project");
    }

    const pluginRepositoryResource = pluginRepositoryResourceList[0];

    const gitOrganization = await this.gitOrganizationByResource({
      where: { id: pluginRepositoryResource.id },
    });

    if (isEmpty(gitOrganization)) {
      throw new Error("Git organization not found for the plugin repository");
    }

    const gitRepository = await this.gitRepository(pluginRepositoryResource.id);

    if (isEmpty(gitRepository)) {
      throw new Error("Git repository not found for the plugin repository");
    }

    const gitProviderArgs =
      await this.gitProviderService.getGitProviderProperties(gitOrganization);

    if (isEmpty(gitProviderArgs)) {
      throw new Error("Git provider args not found for the plugin repository");
    }

    const gitSettings: GitConnectionSettings = {
      gitOrganizationName: gitOrganization.name,
      gitRepositoryName: gitRepository.name,
      baseBranchName: gitRepository.baseBranchName,
      repositoryGroupName: gitRepository.groupName,
      gitProvider: gitProviderArgs.provider,
      gitProviderProperties: gitProviderArgs.providerOrganizationProperties,
    };

    return gitSettings;
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

  async getServiceTemplateSettings(
    resourceId: string,
    user: User
  ): Promise<ServiceTemplateVersion> {
    const resource = await this.resource({
      where: {
        id: resourceId,
      },
    });

    if (!resource || resource.resourceType !== EnumResourceType.Service) {
      return null;
    }

    const settings = await this.serviceSettingsService.getServiceSettingsBlock(
      {
        where: { id: resource.id },
      },
      user
    );

    if (!settings?.serviceTemplateVersion) {
      return null;
    }

    return settings.serviceTemplateVersion;
  }

  async setOwner(
    resourceId: string,
    userId?: string,
    teamId?: string
  ): Promise<Ownership> {
    if (isEmpty(userId) && isEmpty(teamId))
      throw new AmplicationError("ownerId does not provide");

    const ownershipType: EnumOwnershipType = userId
      ? EnumOwnershipType.User
      : EnumOwnershipType.Team;

    const ownerId = userId ? userId : teamId;

    const resource = await this.resource({ where: { id: resourceId } });

    if (resource.ownershipId) {
      return this.ownershipService.updateOwnership(
        resource.ownershipId,
        ownershipType,
        ownerId
      );
    } else {
      const ownerShip = await this.ownershipService.createOwnership(
        ownershipType,
        ownerId
      );

      await this.prisma.resource.update({
        where: { id: resourceId },
        data: { ownershipId: ownerShip.id },
      });

      return ownerShip;
    }
  }

  async getRelatedResource(resourceId: string): Promise<Resource[]> {
    const relations = await this.relationService.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });

    const resourceIds = Array.from(
      new Set(relations.flatMap((relation) => relation.relatedResources))
    );

    return this.resourcesByIds(resourceIds);
  }
}
