import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import { isEmpty } from 'lodash';
import { validateHTMLColorHex } from 'validate-color';
import { App, User, Commit } from 'src/models';
import { FindOneArgs } from 'src/dto';
import { EntityService } from '../entity/entity.service';
import { USER_ENTITY_NAME } from '../entity/constants';
import {
  SAMPLE_APP_DATA,
  CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
  createSampleAppEntities
} from './sampleApp';
import { BuildService } from '../build/build.service'; // eslint-disable-line import/no-cycle
import {
  CreateOneAppArgs,
  FindManyAppArgs,
  UpdateOneAppArgs,
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange
} from './dto';

import { EnvironmentService } from '../environment/environment.service';
import { InvalidColorError } from './InvalidColorError';

const USER_APP_ROLE = {
  name: 'user',
  displayName: 'User'
};

export const DEFAULT_ENVIRONMENT_NAME = 'Sandbox environment';
export const INITIAL_COMMIT_MESSAGE = 'Initial Commit';

export const DEFAULT_APP_COLOR = '#20A4F3';
export const DEFAULT_APP_DATA = {
  color: DEFAULT_APP_COLOR
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService,
    private environmentService: EnvironmentService,
    private buildService: BuildService
  ) {}

  /**
   * Create app in the user's organization, with the built-in "user" role
   */
  async createApp(args: CreateOneAppArgs, user: User): Promise<App> {
    const { color } = args.data;
    if (color && !validateHTMLColorHex(color)) {
      throw new InvalidColorError(color);
    }

    const app = await this.prisma.app.create({
      data: {
        ...DEFAULT_APP_DATA,
        ...args.data,
        organization: {
          connect: {
            id: user.organization?.id
          }
        },
        roles: {
          create: USER_APP_ROLE
        }
      }
    });

    await this.entityService.createDefaultEntities(app.id, user);

    await this.environmentService.createDefaultEnvironment(app.id);

    await this.commit({
      data: {
        app: {
          connect: {
            id: app.id
          }
        },
        message: INITIAL_COMMIT_MESSAGE,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return app;
  }

  /**
   * Create sample app
   * @param user the user to associate the created app with
   */
  async createSampleApp(user: User): Promise<App> {
    const app = await this.createApp(
      {
        data: SAMPLE_APP_DATA
      },
      user
    );

    const userEntity = await this.entityService.findFirst({
      where: { name: USER_ENTITY_NAME, appId: app.id },
      select: { id: true }
    });

    const sampleAppData = createSampleAppEntities(userEntity.id);

    await this.entityService.bulkCreateEntities(
      app.id,
      user,
      sampleAppData.entities
    );
    await this.entityService.bulkCreateFields(
      user,
      userEntity.id,
      sampleAppData.userEntityFields
    );

    await this.commit({
      data: {
        app: {
          connect: {
            id: app.id
          }
        },
        message: CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return app;
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

  /**
   * Gets all the resources changed since the last commit in the app
   */
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
    return this.entityService.getChangedEntities(appId, user.id);
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
    const changedEntities = await this.entityService.getChangedEntities(
      appId,
      userId
    );

    /**@todo: consider discarding locked objects that have no actual changes */

    if (isEmpty(changedEntities)) {
      throw new Error(
        `There are no pending changes for user ${userId} in app ${appId}`
      );
    }

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

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    await this.buildService.create({
      data: {
        app: {
          connect: {
            id: appId
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
    });

    return commit;
  }

  async discardPendingChanges(
    args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
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
    const changedEntities = await this.entityService.getChangedEntities(
      appId,
      userId
    );

    if (isEmpty(changedEntities)) {
      throw new Error(
        `There are no pending changes for user ${userId} in app ${appId}`
      );
    }

    await Promise.all(
      changedEntities.map(change => {
        return this.entityService.discardPendingChanges(
          change.resourceId,
          userId
        );
      })
    );

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    return true;
  }
}
