import { EnumResourceType, PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { FindOneArgs } from '../../dto';
import { Commit, Project, Resource, User } from '../../models';
import { ResourceService, EntityService } from '../';
import { BlockService } from '../block/block.service';
import { BuildService } from '../build/build.service';
import {
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange
} from '../resource/dto';
import { ProjectCreateArgs } from './dto/ProjectCreateArgs';
import { ProjectFindFirstArgs } from './dto/ProjectFindFirstArgs';
import { ProjectFindManyArgs } from './dto/ProjectFindManyArgs';
import { isEmpty } from 'lodash';
@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly blockService: BlockService,
    private readonly buildService: BuildService,
    private readonly entityService: EntityService
  ) {}

  async findProjects(args: ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  async findUnique(args: FindOneArgs): Promise<Project> {
    return this.prisma.project.findUnique(args);
  }

  async findFirst(args: ProjectFindFirstArgs): Promise<Project> {
    return this.prisma.project.findFirst(args);
  }

  async createProject(
    args: ProjectCreateArgs,
    userId: string
  ): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        ...args.data,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id
          }
        }
      }
    });
    await this.resourceService.createProjectConfiguration(project.id, userId);

    return project;
  }

  /**
   * Gets all the origins changed since the last commit in the resource
   */
  async getPendingChanges(
    args: FindPendingChangesArgs,
    user: User
  ): Promise<PendingChange[]> {
    const projectId = args.where.project.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
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
      throw new Error(`Invalid userId or projectId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(projectId, user.id),
      this.blockService.getChangedBlocks(projectId, user.id)
    ]);

    return [...changedEntities, ...changedBlocks];
  }

  async commit(
    args: CreateCommitArgs,
    skipPublish?: boolean
  ): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;

    const resources = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
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

    if (isEmpty(resources)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(projectId, userId),
      this.blockService.getChangedBlocks(projectId, userId)
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
                id: change.originId
              }
            }
          }
        });

        const releasePromise = this.entityService.releaseLock(change.originId);

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
                id: change.originId
              }
            }
          }
        });

        const releasePromise = this.blockService.releaseLock(change.originId);

        return [
          versionPromise.then(() => null),
          releasePromise.then(() => null)
        ];
      })
    );

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    resources
      .filter(res => res.resourceType !== EnumResourceType.ProjectConfiguration)
      .forEach((resource: Resource) =>
        this.buildService.create(
          {
            data: {
              resource: {
                connect: { id: resource.id }
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
        )
      );

    return commit;
  }

  async discardPendingChanges(
    args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
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
      this.entityService.getChangedEntities(projectId, userId),
      this.blockService.getChangedBlocks(projectId, userId)
    ]);

    if (isEmpty(changedEntities) && isEmpty(changedBlocks)) {
      throw new Error(
        `There are no pending changes for user ${userId} in resource ${projectId}`
      );
    }

    const entityPromises = changedEntities.map(change => {
      return this.entityService.discardPendingChanges(change.originId, userId);
    });
    const blockPromises = changedBlocks.map(change => {
      return this.blockService.discardPendingChanges(change.originId, userId);
    });

    await Promise.all(blockPromises);
    await Promise.all(entityPromises);

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    return true;
  }
}
