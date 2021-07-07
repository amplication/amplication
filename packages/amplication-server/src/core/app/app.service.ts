import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import * as semver from 'semver';
import pluralize from 'pluralize';
import { pascalCase } from 'pascal-case';
import { isEmpty } from 'lodash';
import { validateHTMLColorHex } from 'validate-color';
import { App, User, Commit } from 'src/models';
import { FindOneArgs } from 'src/dto';
import { EntityService } from '../entity/entity.service';
import { BlockService } from '../block/block.service';
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
  PendingChange,
  FindAvailableGithubReposArgs,
  AppEnableSyncWithGithubRepoArgs,
  AppValidationResult,
  AppValidationErrorTypes,
  AppCreateWithEntitiesInput
} from './dto';

import { CompleteAuthorizeAppWithGithubArgs } from './dto/CompleteAuthorizeAppWithGithubArgs';

import { AppGenerationConfig } from '@amplication/data-service-generator';

import { EnvironmentService } from '../environment/environment.service';
import { InvalidColorError } from './InvalidColorError';
import { GithubService } from '../github/github.service';
import { GithubRepo } from '../github/dto/githubRepo';
import { ReservedEntityNameError } from './ReservedEntityNameError';
import { EnumDataType } from 'src/enums/EnumDataType';
import { QueryMode } from 'src/enums/QueryMode';
import { prepareDeletedItemName } from '../../util/softDelete';

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

export const INVALID_APP_ID = 'Invalid appId';

const APP_CONFIG_FILE_PATH = 'ampconfig.json';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private entityService: EntityService,
    private blockService: BlockService,
    private environmentService: EnvironmentService,
    private buildService: BuildService,
    private readonly githubService: GithubService
  ) {}

  /**
   * Create app in the user's workspace, with the built-in "user" role
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
        workspace: {
          connect: {
            id: user.workspace?.id
          }
        },
        roles: {
          create: USER_APP_ROLE
        }
      }
    });

    await this.entityService.createDefaultEntities(app.id, user);

    await this.environmentService.createDefaultEnvironment(app.id);

    try {
      await this.commit(
        {
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
        },
        true
      );
    } catch {} //ignore - return the new app and the message will be available on the build log

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

  /**
   * Create an app with entities and field in one transaction, based only on entities and fields names
   * @param user the user to associate the created app with
   */
  async createAppWithEntities(
    data: AppCreateWithEntitiesInput,
    user: User
  ): Promise<App> {
    if (
      data.entities.find(
        entity => entity.name.toLowerCase() === USER_ENTITY_NAME.toLowerCase()
      )
    ) {
      throw new ReservedEntityNameError(USER_ENTITY_NAME);
    }

    const existingApps = await this.prisma.app.findMany({
      where: {
        name: {
          mode: QueryMode.Insensitive,
          startsWith: data.app.name
        },
        workspaceId: user.workspace.id,
        deletedAt: null
      },
      select: {
        name: true
      }
    });

    const appName = data.app.name;
    let index = 1;
    while (
      existingApps.find(app => {
        return app.name.toLowerCase() === data.app.name.toLowerCase();
      })
    ) {
      data.app.name = `${appName}-${index}`;
      index += 1;
    }

    const app = await this.createApp(
      {
        data: data.app
      },
      user
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
            app: {
              connect: {
                id: app.id
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
            app: {
              connect: {
                id: app.id
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
      } catch {} //ignore - return the new app and the message will be available on the build log
    }

    return app;
  }

  async app(args: FindOneArgs): Promise<App | null> {
    return this.prisma.app.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null
      }
    });
  }

  async apps(args: FindManyAppArgs): Promise<App[]> {
    return this.prisma.app.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  async deleteApp(args: FindOneArgs): Promise<App | null> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    return this.prisma.app.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(app.name, app.id),
        deletedAt: new Date()
      }
    });
  }

  async updateApp(args: UpdateOneAppArgs): Promise<App | null> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

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
        deletedAt: null,
        workspace: {
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

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(appId, user.id),
      this.blockService.getChangedBlocks(appId, user.id)
    ]);

    return [...changedEntities, ...changedBlocks];
  }

  async commit(
    args: CreateCommitArgs,
    skipPublish?: boolean
  ): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const appId = args.data.app.connect.id;

    const app = await this.prisma.app.findMany({
      where: {
        id: appId,
        deletedAt: null,
        workspace: {
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

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(appId, userId),
      this.blockService.getChangedBlocks(appId, userId)
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
      },
      skipPublish
    );

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
        deletedAt: null,
        workspace: {
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

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(appId, userId),
      this.blockService.getChangedBlocks(appId, userId)
    ]);

    if (isEmpty(changedEntities) && isEmpty(changedBlocks)) {
      throw new Error(
        `There are no pending changes for user ${userId} in app ${appId}`
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

  async startAuthorizeAppWithGithub(appId: string): Promise<string> {
    return this.githubService.getOAuthAppAuthorizationUrl(appId);
  }

  async completeAuthorizeAppWithGithub(
    args: CompleteAuthorizeAppWithGithubArgs
  ): Promise<App> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    const token = await this.githubService.createOAuthAppAuthorizationToken(
      args.data.state,
      args.data.code
    );

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.app.update({
      where: args.where,
      data: {
        githubToken: token,
        githubTokenCreatedDate: new Date()
      }
    });
  }

  async removeAuthorizeAppWithGithub(args: FindOneArgs): Promise<App> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(`This app is not authorized with any GitHub repo.`);
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.app.update({
      where: args.where,
      data: {
        githubToken: null,
        githubTokenCreatedDate: null,
        githubSyncEnabled: false,
        githubRepo: null,
        githubBranch: null
      }
    });
  }

  async findAvailableGithubRepos(
    args: FindAvailableGithubReposArgs
  ): Promise<GithubRepo[]> {
    const app = await this.app({
      where: {
        id: args.where.app.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(
        `Sync cannot be enabled since this app is not authorized with any GitHub repo. You should first complete the authorization process`
      );
    }

    return await this.githubService.listRepoForAuthenticatedUser(
      app.githubToken
    );
  }

  /**
   * Runs validations on the app and returns a list of warnings.
   * When the validation fails, a commit can still be executed and it is up to the user/client to decide how to handle the warnings.
   * @todo: Add mechanism to run validation on the server before commit and prevent commit with errors
   *
   */
  async validateBeforeCommit(args: FindOneArgs): Promise<AppValidationResult> {
    const messages = [];
    let isValid = true;

    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (!app.githubSyncEnabled) return { isValid, messages };
    if (!app.githubLastSync) return { isValid, messages }; //if the repo was never synced before, skip the below validation as they are all related to GitHub sync

    const config = await this.getAppGenerationConfigFromGitHub(args);

    if (!config) {
      isValid = false;
      messages.push(AppValidationErrorTypes.DataServiceGeneratorVersionMissing);
      //since the config is empty, return immediately
      return { isValid, messages };
    }

    if (!config.dataServiceGeneratorVersion) {
      isValid = false;
      messages.push(AppValidationErrorTypes.DataServiceGeneratorVersionMissing);
    }

    if (
      config.dataServiceGeneratorVersion &&
      !semver.valid(config.dataServiceGeneratorVersion)
    ) {
      isValid = false;
      messages.push(AppValidationErrorTypes.DataServiceGeneratorVersionInvalid);
    }

    if (
      semver.valid(config.dataServiceGeneratorVersion) &&
      semver.lt(config.dataServiceGeneratorVersion, '0.4.0')
    ) {
      isValid = false;
      messages.push(
        AppValidationErrorTypes.CannotMergeCodeToGitHubBreakingChanges
      );
    }

    if (config?.appInfo?.id != app.id) {
      isValid = false;
      messages.push(
        AppValidationErrorTypes.CannotMergeCodeToGitHubInvalidAppId
      );
    }

    return {
      isValid,
      messages
    };
  }

  async getAppGenerationConfigFromGitHub(
    args: FindOneArgs
  ): Promise<AppGenerationConfig | null> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(`This app is not authorized with any GitHub repo`);
    }
    const [userName, repoName] = app.githubRepo.split('/');
    let configFile;

    try {
      configFile = await this.githubService.getFile(
        userName,
        repoName,
        APP_CONFIG_FILE_PATH,
        app.githubBranch,
        app.githubToken
      );
    } catch (error) {
      //in case the file was not found on GitHub, return null
      return null;
    }

    let config;
    try {
      config = JSON.parse(configFile.content);
    } catch (error) {
      throw new Error(
        `Unexpected config file format in the linked GitHub repo. The file must be a valid JSON object`
      );
    }

    return config;
  }

  async enableSyncWithGithubRepo(
    args: AppEnableSyncWithGithubRepoArgs
  ): Promise<App> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (app.githubSyncEnabled) {
      throw new Error(
        `Sync is already enabled for this app. To change the sync settings, first disable the sync and re-enable it with the new settings`
      );
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(
        `Sync cannot be enabled since this app is not authorized with any GitHub repo. You should first complete the authorization process`
      );
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.app.update({
      where: args.where,
      data: {
        ...args.data,
        githubSyncEnabled: true
      }
    });
  }

  async disableSyncWithGithubRepo(args: FindOneArgs): Promise<App> {
    const app = await this.app({
      where: {
        id: args.where.id
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (!app.githubSyncEnabled) {
      throw new Error(`Sync is not enabled for this app`);
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.app.update({
      where: args.where,
      data: {
        githubRepo: null, //reset the repo and branch to allow the user to set another branch when needed
        githubBranch: null,
        githubSyncEnabled: false,
        githubLastSync: null
      }
    });
  }

  async reportSyncMessage(appId: string, message: string): Promise<App> {
    const app = await this.app({
      where: {
        id: appId
      }
    });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    //directly update with prisma since we don't want to expose these fields for regular updates
    return this.prisma.app.update({
      where: {
        id: appId
      },
      data: {
        githubLastMessage: message,
        githubLastSync: new Date()
      }
    });
  }
}
