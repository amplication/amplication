import {
  PrismaService,
  GitRepository,
  Prisma,
  EnumResourceType,
} from "../../prisma";
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { isEmpty } from "lodash";
import { pascalCase } from "pascal-case";
import pluralize from "pluralize";
import { FindOneArgs } from "../../dto";
import { EnumDataType } from "../../enums/EnumDataType";
import { QueryMode } from "../../enums/QueryMode";
import { Project, Resource, User, GitOrganization } from "../../models";
import { prepareDeletedItemName } from "../../util/softDelete";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { USER_ENTITY_NAME } from "../entity/constants";
import { EntityService } from "../entity/entity.service";
import { EnvironmentService } from "../environment/environment.service";
import {
  CreateOneResourceArgs,
  FindManyResourceArgs,
  ResourceCreateWithEntitiesInput,
  UpdateOneResourceArgs,
  ResourceCreateWithEntitiesResult,
  UpdateCodeGeneratorVersionArgs,
} from "./dto";
import { ReservedEntityNameError } from "./ReservedEntityNameError";
import { ProjectConfigurationExistError } from "./errors/ProjectConfigurationExistError";
import { ProjectConfigurationSettingsService } from "../projectConfigurationSettings/projectConfigurationSettings.service";
import { AmplicationError } from "../../errors/AmplicationError";

const USER_RESOURCE_ROLE = {
  name: "user",
  displayName: "User",
};

export const DEFAULT_ENVIRONMENT_NAME = "Sandbox environment";
export const INITIAL_COMMIT_MESSAGE = "Initial Commit";

export const INVALID_RESOURCE_ID = "Invalid resourceId";
export const INVALID_DELETE_PROJECT_CONFIGURATION =
  "The resource of type `ProjectConfiguration` cannot be deleted";
import { ProjectService } from "../project/project.service";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { TopicService } from "../topic/topic.service";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "../billing/billing.types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConnectGitRepositoryInput } from "../git/dto/inputs/ConnectGitRepositoryInput";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { JsonValue } from "type-fest";

const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  "This resource is used to store project configuration.";

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
    private readonly analytics: SegmentAnalyticsService
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
    gitRepositoryToCreate: ConnectGitRepositoryInput = null,
    wizardType: string = null
  ): Promise<Resource> {
    if (args.data.resourceType === EnumResourceType.ProjectConfiguration) {
      throw new AmplicationError(
        "Resource of type Project Configuration cannot be created manually"
      );
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
        gitRepositoryOverride: gitRepositoryToCreate?.isOverrideGitRepository,
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
    const resource = await this.createResource({
      data: {
        ...args.data,
        resourceType: EnumResourceType.MessageBroker,
      },
    });
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
      for (let index = 0; index < data.plugins.plugins.length; index++) {
        const currentPlugin = data.plugins.plugins[index];

        currentPlugin.resource = { connect: { id: resource.id } };
        const isvValidEntityUser = await this.userEntityValidation(
          resource.id,
          currentPlugin.configurations
        );
        isvValidEntityUser &&
          (await this.pluginInstallationService.create(
            { data: currentPlugin },
            user
          ));
      }
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
        gitOrganizationName: gitRepository?.name,
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
