import {
  EnumResourceType,
  GitRepository,
  Prisma,
  PrismaService
} from '@amplication/prisma-db';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { pascalCase } from 'pascal-case';
import pluralize from 'pluralize';
import { FindOneArgs } from '../../dto';
import { EnumDataType } from '../../enums/EnumDataType';
import { QueryMode } from '../../enums/QueryMode';
import { Project, Resource, User, GitOrganization } from '../../models';
import { prepareDeletedItemName } from '../../util/softDelete';
import { ServiceSettingsService } from '../serviceSettings/serviceSettings.service';
import { USER_ENTITY_NAME } from '../entity/constants';
import { EntityService } from '../entity/entity.service';
import { EnvironmentService } from '../environment/environment.service';
import {
  CreateOneResourceArgs,
  FindManyResourceArgs,
  ResourceCreateWithEntitiesInput,
  UpdateOneResourceArgs
} from './dto';
import { ReservedEntityNameError } from './ReservedEntityNameError';
import { ProjectConfigurationExistError } from './errors/ProjectConfigurationExistError';
import { ProjectConfigurationSettingsService } from '../projectConfigurationSettings/projectConfigurationSettings.service';
import { AmplicationError } from 'src/errors/AmplicationError';

const USER_RESOURCE_ROLE = {
  name: 'user',
  displayName: 'User'
};

export const DEFAULT_ENVIRONMENT_NAME = 'Sandbox environment';
export const INITIAL_COMMIT_MESSAGE = 'Initial Commit';

export const INVALID_RESOURCE_ID = 'Invalid resourceId';
export const INVALID_DELETE_PROJECT_CONFIGURATION =
  'The resource of type `ProjectConfiguration` cannot be deleted';
import { ResourceGenSettingsCreateInput } from './dto/ResourceGenSettingsCreateInput';
import { ProjectService } from '../project/project.service';
import { ServiceTopicsService } from '../serviceTopics/serviceTopics.service';

const DEFAULT_PROJECT_CONFIGURATION_NAME = 'Project Configuration';
const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  'This resource is used to store project configuration.';

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService,
    private environmentService: EnvironmentService,
    private serviceSettingsService: ServiceSettingsService,
    private readonly projectConfigurationSettingsService: ProjectConfigurationSettingsService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly serviceTopicsService: ServiceTopicsService
  ) {}

  async createProjectConfiguration(
    projectId: string,
    userId: string
  ): Promise<Resource> {
    const existingProjectConfiguration = await this.prisma.resource.findFirst({
      where: { projectId, resourceType: EnumResourceType.ProjectConfiguration }
    });

    if (!isEmpty(existingProjectConfiguration)) {
      throw new ProjectConfigurationExistError();
    }

    const newProjectConfiguration = await this.prisma.resource.create({
      data: {
        resourceType: EnumResourceType.ProjectConfiguration,
        description: DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION,
        name: DEFAULT_PROJECT_CONFIGURATION_NAME,
        project: { connect: { id: projectId } }
      }
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
  private async createResource(args: CreateOneResourceArgs): Promise<Resource> {
    if (args.data.resourceType === EnumResourceType.ProjectConfiguration) {
      throw new AmplicationError(
        'Resource of type Project Configuration cannot be created manually'
      );
    }

    const projectId = args.data.project.connect.id;

    const projectConfiguration = await this.projectConfiguration(projectId);

    if (isEmpty(projectConfiguration)) {
      throw new AmplicationError('Project configuration missing from project');
    }

    const originalName = args.data.name;
    const existingResources = await this.prisma.resource.findMany({
      where: {
        name: {
          mode: QueryMode.Insensitive,
          startsWith: args.data.name.toLowerCase()
        },
        projectId: projectId,
        deletedAt: null
      },
      select: {
        name: true
      }
    });

    let index = 1;
    while (
      index < 10 &&
      existingResources.find(resource => {
        return resource.name.toLowerCase() === args.data.name.toLowerCase();
      })
    ) {
      args.data.name = `${originalName}-${index}`;
      index += 1;
    }

    let gitRepository:
      | Prisma.GitRepositoryCreateNestedOneWithoutResourcesInput
      | undefined = undefined;
    if (projectConfiguration.gitRepositoryId) {
      gitRepository = {
        connect: { id: projectConfiguration.gitRepositoryId || '' }
      };
    }

    return this.prisma.resource.create({
      data: {
        ...args.data,
        gitRepository
      }
    });
  }

  /**
   * Create a resource of type "Service", with the built-in "user" role
   */
  async createMessageBroker(args: CreateOneResourceArgs): Promise<Resource> {
    const resource = await this.createResource({
      data: {
        ...args.data,
        resourceType: EnumResourceType.MessageBroker
      }
    });

    return resource;
  }

  /**
   * Create a resource of type "Service", with the built-in "user" role
   */
  async createService(
    args: CreateOneResourceArgs,
    user: User,
    generationSettings: ResourceGenSettingsCreateInput = null
  ): Promise<Resource> {
    const resource = await this.createResource({
      data: {
        ...args.data,
        resourceType: EnumResourceType.Service
      }
    });

    await this.prisma.resourceRole.create({
      data: { ...USER_RESOURCE_ROLE, resourceId: resource.id }
    });

    await this.entityService.createDefaultEntities(resource.id, user);

    await this.environmentService.createDefaultEnvironment(resource.id);

    await this.serviceSettingsService.createDefaultServiceSettings(
      resource.id,
      user,
      generationSettings
    );

    return resource;
  }

  /**
   * Create a resource of type "Service" with entities and fields in one transaction, based only on entities and fields names
   * @param user the user to associate the created resource with
   */
  async createServiceWithEntities(
    data: ResourceCreateWithEntitiesInput,
    user: User
  ): Promise<Resource> {
    if (
      data.entities.find(
        entity => entity.name.toLowerCase() === USER_ENTITY_NAME.toLowerCase()
      )
    ) {
      throw new ReservedEntityNameError(USER_ENTITY_NAME);
    }

    const resource = await this.createService(
      {
        data: data.resource
      },
      user,
      data.generationSettings
    );

    const newEntities: {
      [index: number]: { entityId: string; name: string };
    } = {};

    for (const { entity, index } of data.entities.map((entity, index) => ({
      index,
      entity
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
                id: resource.id
              }
            },
            displayName: displayName,
            name: name,
            pluralDisplayName: pluralDisplayName
          }
        },
        user
      );

      newEntities[index] = {
        entityId: newEntity.id,
        name: newEntity.name
      };

      for (const entityField of entity.fields) {
        await this.entityService.createFieldByDisplayName(
          {
            data: {
              entity: {
                connect: {
                  id: newEntity.id
                }
              },
              displayName: entityField.name,
              dataType: entityField.dataType
            }
          },
          user
        );
      }
    }

    //after all entities were created, create the relation fields
    for (const { entity, index } of data.entities.map((entity, index) => ({
      index,
      entity
    }))) {
      if (entity.relationsToEntityIndex) {
        for (const relationToIndex of entity.relationsToEntityIndex) {
          await this.entityService.createFieldByDisplayName(
            {
              data: {
                entity: {
                  connect: {
                    id: newEntities[index].entityId
                  }
                },
                displayName: newEntities[relationToIndex].name,
                dataType: EnumDataType.Lookup
              }
            },
            user
          );
        }
      }
    }

    return resource;
  }

  async resource(args: FindOneArgs): Promise<Resource | null> {
    return this.prisma.resource.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null
      }
    });
  }

  async resources(args: FindManyResourceArgs): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  async messageBrokerConnectedServices(args: FindOneArgs): Promise<Resource[]> {
    const resource = await this.resource(args);
    const serviceTopicsCollection = await this.serviceTopicsService.findMany({
      where: { resource: { projectId: resource.projectId } }
    });
    const brokerServiceTopics = serviceTopicsCollection.filter(
      x => x.messageBrokerId === resource.id && x.enabled
    );

    const promises = brokerServiceTopics.map(x => {
      return this.resource({
        where: { id: x.resourceId }
      }); 
    }); 

    const resources = await Promise.all(promises);

    return resources;
  }

  async deleteResource(args: FindOneArgs): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: args.where.id
      },
      include: {
        gitRepository: true
      }
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    if (resource.resourceType === EnumResourceType.ProjectConfiguration) {
      throw new Error(INVALID_DELETE_PROJECT_CONFIGURATION);
    }

    await this.prisma.resource.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(resource.name, resource.id),
        deletedAt: new Date(),
        gitRepository: {
          disconnect: true
        }
      }
    });

    if (!resource.gitRepositoryOverride) {
      return resource;
    }

    return await this.deleteResourceGitRepository(resource);
  }

  async deleteResourceGitRepository(resource: Resource): Promise<Resource> {
    const gitRepo = await this.prisma.gitRepository.findFirst({
      where: {
        resources: { every: { id: resource.id } }
      }
    });

    if (!gitRepo) {
      await this.prisma.gitRepository.delete({
        where: {
          id: resource.gitRepositoryId
        }
      });
    }

    return resource;
  }

  async updateResource(args: UpdateOneResourceArgs): Promise<Resource | null> {
    const resource = await this.resource({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    return this.prisma.resource.update(args);
  }

  async reportSyncMessage(
    resourceId: string,
    message: string
  ): Promise<Resource> {
    const resource = await this.resource({
      where: {
        id: resourceId
      }
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.resource.update({
      where: {
        id: resourceId
      },
      data: {
        githubLastMessage: message,
        githubLastSync: new Date()
      }
    });
  }

  async gitRepository(resourceId: string): Promise<GitRepository | null> {
    return (
      await this.prisma.resource.findUnique({
        where: { id: resourceId },
        include: { gitRepository: { include: { gitOrganization: true } } }
      })
    ).gitRepository;
  }

  async gitOrganizationByResource(
    args: FindOneArgs
  ): Promise<GitOrganization | null> {
    return (
      await this.prisma.resource.findUnique({
        ...args,
        include: { gitRepository: { include: { gitOrganization: true } } }
      })
    ).gitRepository.gitOrganization;
  }

  async project(resourceId: string): Promise<Project> {
    return this.projectService.findFirst({
      where: { resources: { some: { id: resourceId } } }
    });
  }

  async projectConfiguration(projectId: string): Promise<Resource | null> {
    return await this.prisma.resource.findFirst({
      where: {
        resourceType: EnumResourceType.ProjectConfiguration,
        project: { id: projectId }
      }
    });
  }
}
