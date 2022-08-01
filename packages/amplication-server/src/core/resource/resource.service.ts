import {
  EnumResourceType,
  GitRepository,
  PrismaService
} from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { pascalCase } from 'pascal-case';
import pluralize from 'pluralize';
import { FindOneArgs } from 'src/dto';
import { EnumDataType } from 'src/enums/EnumDataType';
import { QueryMode } from 'src/enums/QueryMode';
import { Commit, Project, Resource, User } from 'src/models';
import { validateHTMLColorHex } from 'validate-color';
import { prepareDeletedItemName } from '../../util/softDelete';
import { ServiceSettingsService } from '../serviceSettings/serviceSettings.service';
import { BlockService } from '../block/block.service';
import { BuildService } from '../build/build.service'; // eslint-disable-line import/no-cycle
import { USER_ENTITY_NAME } from '../entity/constants';
import { EntityService } from '../entity/entity.service';
import { EnvironmentService } from '../environment/environment.service';
import {
  CreateCommitArgs,
  CreateOneResourceArgs,
  DiscardPendingChangesArgs,
  FindManyResourceArgs,
  FindPendingChangesArgs,
  PendingChange,
  ResourceCreateWithEntitiesInput,
  UpdateOneResourceArgs
} from './dto';
import { InvalidColorError } from './InvalidColorError';
import { ReservedEntityNameError } from './ReservedEntityNameError';
import { ProjectConfigurationExistError } from './errors/ProjectConfigurationExistError';
import { ProjectConfigurationSettingsService } from '../projectConfigurationSettings/projectConfigurationSettings.service';
import { DEFAULT_RESOURCE_COLORS } from './constants';

const USER_RESOURCE_ROLE = {
  name: 'user',
  displayName: 'User'
};

export const DEFAULT_ENVIRONMENT_NAME = 'Sandbox environment';
export const INITIAL_COMMIT_MESSAGE = 'Initial Commit';

export const DEFAULT_SERVICE_DATA = {
  color: DEFAULT_RESOURCE_COLORS.service
};

export const INVALID_RESOURCE_ID = 'Invalid resourceId';
export const INVALID_DELETE_PROJECT_CONFIGURATION =
  'The resource of type `ProjectConfiguration` cannot be deleted';
import { ResourceGenSettingsCreateInput } from './dto/ResourceGenSettingsCreateInput';

const DEFAULT_PROJECT_CONFIGURATION_NAME = 'Project Configuration';
const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  'This resource is used to store project configuration.';

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService,
    private blockService: BlockService,
    private environmentService: EnvironmentService,
    private buildService: BuildService,
    private serviceSettingsService: ServiceSettingsService,
    private readonly projectConfigurationSettingsService: ProjectConfigurationSettingsService
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
        color: DEFAULT_RESOURCE_COLORS.projectConfiguration,
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
   * Create resource in the user's workspace, with the built-in "user" role
   */
  async createResource(
    args: CreateOneResourceArgs,
    user: User,
    generationSettings: ResourceGenSettingsCreateInput = null
  ): Promise<Resource> {
    const { color } = args.data;
    if (color && !validateHTMLColorHex(color)) {
      throw new InvalidColorError(color);
    }

    const resource = await this.prisma.resource.create({
      data: {
        ...DEFAULT_SERVICE_DATA,
        ...args.data,
        roles: {
          create: USER_RESOURCE_ROLE
        }
      }
    });

    await this.entityService.createDefaultEntities(resource.id, user);

    await this.environmentService.createDefaultEnvironment(resource.id);

    await this.serviceSettingsService.createDefaultServiceSettings(
      resource.id,
      user,
      generationSettings
    );

    try {
      await this.commit(
        {
          data: {
            resource: {
              connect: {
                id: resource.id
              }
            },
            message: INITIAL_COMMIT_MESSAGE,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        },
        true
      );
    } catch {} //ignore - return the new resource and the message will be available on the build log

    return resource;
  }

  /**
   * Create an resource with entities and field in one transaction, based only on entities and fields names
   * @param user the user to associate the created resource with
   */
  async createResourceWithEntities(
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

    const existingResources = await this.prisma.resource.findMany({
      where: {
        name: {
          mode: QueryMode.Insensitive,
          startsWith: data.resource.name
        },
        projectId: data.resource.project.connect.id,
        deletedAt: null
      },
      select: {
        name: true
      }
    });

    const resourceName = data.resource.name;
    let index = 1;
    while (
      existingResources.find(resource => {
        return resource.name.toLowerCase() === data.resource.name.toLowerCase();
      })
    ) {
      data.resource.name = `${resourceName}-${index}`;
      index += 1;
    }

    const resource = await this.createResource(
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
    // do not commit if there are no entities
    if (!isEmpty(data.entities)) {
      try {
        await this.commit({
          data: {
            resource: {
              connect: {
                id: resource.id
              }
            },
            message: data.commitMessage,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
      } catch {} //ignore - return the new resource and the message will be available on the build log
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

  async deleteResource(args: FindOneArgs): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(resource)) {
      throw new Error(INVALID_RESOURCE_ID);
    }

    if (resource.resourceType === EnumResourceType.ProjectConfiguration) {
      throw new Error(INVALID_DELETE_PROJECT_CONFIGURATION);
    }

    const gitRepo = await this.prisma.gitRepository.findUnique({
      where: {
        resourceId: resource.id
      }
    });

    if (gitRepo) {
      await this.prisma.gitRepository.delete({
        where: {
          id: gitRepo.id
        }
      });
    }

    return this.prisma.resource.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(resource.name, resource.id),
        deletedAt: new Date()
      }
    });
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

  /**
   * Gets all the resources changed since the last commit in the resource
   */
  async getPendingChanges(
    args: FindPendingChangesArgs,
    user: User
  ): Promise<PendingChange[]> {
    const resourceId = args.where.resource.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        id: resourceId,
        deletedAt: null,
        project: {
          workspace: {
            users: {
              some: {
                id: user.id
              }
            }
          }
        }
      }
    });

    if (isEmpty(resource)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(resourceId, user.id),
      this.blockService.getChangedBlocks(resourceId, user.id)
    ]);

    return [...changedEntities, ...changedBlocks];
  }

  async commit(
    args: CreateCommitArgs,
    skipPublish?: boolean
  ): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const resourceId = args.data.resource.connect.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        id: resourceId,
        deletedAt: null,
        project: {
          workspace: {
            users: {
              some: {
                id: userId
              }
            }
          }
        }
      }
    });

    if (isEmpty(resource)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(resourceId, userId),
      this.blockService.getChangedBlocks(resourceId, userId)
    ]);

    /**@todo: consider discarding locked objects that have no actual changes */

    const commit = await this.prisma.commit.create(args);

    await Promise.all(
      changedEntities.flatMap(change => {
        const versionPromise = this.entityService.createVersion({
          data: {
            commit: {
              connect: {
                id: commit.id
              }
            },
            entity: {
              connect: {
                id: change.resourceId
              }
            }
          }
        });

        const releasePromise = this.entityService.releaseLock(
          change.resourceId
        );

        return [
          versionPromise.then(() => null),
          releasePromise.then(() => null)
        ];
      })
    );

    await Promise.all(
      changedBlocks.flatMap(change => {
        const versionPromise = this.blockService.createVersion({
          data: {
            commit: {
              connect: {
                id: commit.id
              }
            },
            block: {
              connect: {
                id: change.resourceId
              }
            }
          }
        });

        const releasePromise = this.blockService.releaseLock(change.resourceId);

        return [
          versionPromise.then(() => null),
          releasePromise.then(() => null)
        ];
      })
    );

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    await this.buildService.create(
      {
        data: {
          resource: {
            connect: {
              id: resourceId
            }
          },
          commit: {
            connect: {
              id: commit.id
            }
          },
          createdBy: {
            connect: {
              id: userId
            }
          },
          message: args.data.message
        }
      },
      skipPublish
    );

    return commit;
  }

  async discardPendingChanges(
    args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    const userId = args.data.user.connect.id;
    const resourceId = args.data.resource.connect.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        id: resourceId,
        deletedAt: null,
        project: {
          workspace: {
            users: {
              some: {
                id: userId
              }
            }
          }
        }
      }
    });

    if (isEmpty(resource)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(resourceId, userId),
      this.blockService.getChangedBlocks(resourceId, userId)
    ]);

    if (isEmpty(changedEntities) && isEmpty(changedBlocks)) {
      throw new Error(
        `There are no pending changes for user ${userId} in resource ${resourceId}`
      );
    }

    const entityPromises = changedEntities.map(change => {
      return this.entityService.discardPendingChanges(
        change.resourceId,
        userId
      );
    });
    const blockPromises = changedBlocks.map(change => {
      return this.blockService.discardPendingChanges(change.resourceId, userId);
    });

    await Promise.all(blockPromises);
    await Promise.all(entityPromises);

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    return true;
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
    return await this.prisma.gitRepository.findUnique({
      where: {
        resourceId
      },
      include: {
        gitOrganization: true
      }
    });
  }

  async project(resourceId: string): Promise<Project> {
    return this.prisma.project.findUnique({ where: { id: resourceId } });
  }
}
