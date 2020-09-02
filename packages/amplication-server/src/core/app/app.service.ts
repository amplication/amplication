import { Injectable } from '@nestjs/common';
import { SortOrder } from '@prisma/client';
import { App, User, Commit } from 'src/models';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateOneAppArgs,
  FindManyAppArgs,
  UpdateOneAppArgs,
  CreateCommitArgs,
  FindPendingChangesArgs,
  PendingChange
} from './dto';
import { FindOneArgs } from 'src/dto';
import { EntityService } from '../entity/entity.service';
import { isEmpty } from 'lodash';
import { CURRENT_VERSION_NUMBER } from '../entity/constants';

const USER_APP_ROLE = {
  name: 'user',
  displayName: 'User'
};
@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService
  ) {}

  /**
   * Create app in the user's organization, with the built-in "user" role
   */
  async createApp(args: CreateOneAppArgs, user: User): Promise<App> {
    return this.prisma.app.create({
      data: {
        ...args.data,
        organization: {
          connect: {
            id: user.organization?.id
          }
        },
        appRoles: {
          create: USER_APP_ROLE
        }
      }
    });
  }

  async app(args: FindOneArgs): Promise<App | null> {
    return this.prisma.app.findOne(args);
  }

  async apps(args: FindManyAppArgs): Promise<App[]> {
    return this.prisma.app.findMany(args);
  }

  async deleteApp(args: FindOneArgs): Promise<App | null> {
    return this.prisma.app.delete(args);
  }

  async updateApp(args: UpdateOneAppArgs): Promise<App | null> {
    return this.prisma.app.update(args);
  }

  async getPendingChanges(
    args: FindPendingChangesArgs,
    user: User
  ): Promise<PendingChange[]> {
    const appId = args.where.app.id;

    const app = await this.prisma.app.findMany({
      where: {
        id: appId,
        organization: {
          users: {
            some: {
              id: user.id
            }
          }
        }
      }
    });

    if (isEmpty(app)) {
      throw new Error(`Invalid userId or appId`);
    }

    /**@todo: do the same for Blocks */
    return this.entityService.getChangedEntities(user.id);
  }

  async commit(args: CreateCommitArgs): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const appId = args.data.app.connect.id;

    const app = await this.prisma.app.findMany({
      where: {
        id: appId,
        organization: {
          users: {
            some: {
              id: userId
            }
          }
        }
      }
    });

    if (isEmpty(app)) {
      throw new Error(`Invalid userId or appId`);
    }

    /**@todo: do the same for Blocks */
    /**@todo: move to entity service */
    const changedEntities = await this.prisma.entity.findMany({
      where: {
        lockedByUserId: userId
      }
    });

    /**@todo: consider discarding locked objects that have no actual changes */

    if (isEmpty(changedEntities)) {
      throw new Error(
        `There are no pending changes for user ${userId} in app ${appId}`
      );
    }

    const commit = await this.prisma.commit.create(args);

    changedEntities.flatMap(entity => {
      const versionPromise = this.entityService.createVersion({
        data: {
          commit: {
            connect: {
              id: commit.id
            }
          },
          entity: {
            connect: {
              id: entity.id
            }
          }
        }
      });

      const unlockPromise = this.entityService.releaseLock(entity.id);

      return [versionPromise, unlockPromise];
    });

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    return commit;
  }
}
