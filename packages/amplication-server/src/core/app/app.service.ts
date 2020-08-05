import { Injectable } from '@nestjs/common';
import { App, User, Commit } from 'src/models';
import { PrismaService } from 'src/services/prisma.service';

import {
  CreateOneAppArgs,
  FindManyAppArgs,
  UpdateOneAppArgs,
  CreateCommitArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService
  ) {}

  /**
   * Create app in the user's organization
   */
  async createApp(args: CreateOneAppArgs, user: User): Promise<App> {
    return this.prisma.app.create({
      data: {
        ...args.data,
        organization: {
          connect: {
            id: user.organization?.id
          }
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

  async commit(args: CreateCommitArgs): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const appId = args.data.app.connect.id;

    const user = await this.prisma.user.findOne({
      where: {
        id: userId
      }
    });

    const app = await this.prisma.app.findMany({
      where: {
        id: appId,
        organizationId: user.organizationId
      }
    });

    if (!app || !app.length) {
      throw new Error(`Invalid userId or appId`);
    }

    const changedEntities = await this.prisma.entity.findMany({
      where: {
        lockedByUserId: userId
      }
    });
    /**@todo: do the same for Blocks */

    if (!changedEntities || !(await changedEntities).length) {
      throw new Error(
        `There are not pending changes for user ${userId} in app ${appId}`
      );
    }

    const commit = await this.prisma.commit.create(args);

    const allPromises = changedEntities.flatMap(entity => {
      const version = this.entityService.createVersion({
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

      const unlock = this.entityService.unlockEntity(entity.id);

      return [version, unlock];
    });

    // @ts-ignore
    await this.prisma.$transaction(allPromises);

    return commit;
  }
}
