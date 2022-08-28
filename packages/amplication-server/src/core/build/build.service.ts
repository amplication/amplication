import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, MethodNotSupported } from '@slynova/flydrive';
import { GoogleCloudStorage } from '@slynova/flydrive-gcs';
import { StorageService } from '@codebrew/nestjs-storage';
import { Prisma, PrismaService } from '@amplication/prisma-db';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { omit, orderBy } from 'lodash';
import path from 'path';
import { Entity, ResourceRole, User } from 'src/models';
import { Build } from './dto/Build';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { getBuildZipFilePath } from './storage';
import {
  BuildStatus,
  GenerateResource,
  StorageTypeEnum
} from '@amplication/build-types';
import { BuildStatus as BuildStatusDto } from './dto/BuildStatus';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { EntityService } from '../entity/entity.service';
import { StepNotCompleteError } from './errors/StepNotCompleteError';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { ResourceRoleService } from '../resourceRole/resourceRole.service';
import { ResourceService } from '../resource/resource.service'; // eslint-disable-line import/no-cycle
import {
  EnumActionStepStatus,
  EnumActionLogLevel,
  ActionStep
} from '../action/dto';
import { UserService } from '../user/user.service'; // eslint-disable-line import/no-cycle
import { ServiceSettingsService } from '../serviceSettings/serviceSettings.service'; // eslint-disable-line import/no-cycle
import { ActionService } from '../action/action.service';

import { LocalDiskService } from '../storage/local.disk.service';
import { StepNotFoundError } from './errors/StepNotFoundError';
import { QueueService } from '../queue/queue.service';
import { BuildFilesSaver, previousBuild } from './utils';
import { EnumGitProvider } from '../git/dto/enums/EnumGitProvider';
import { CanUserAccessArgs } from './dto/CanUserAccessArgs';
import { GitResourceMeta } from './dto/GitResourceMeta';
import { BuildContext } from './dto/BuildContext';
import { BuildContextData } from './dto/BuildContextData';
import { BuildContextStorageService } from './buildContextStorage.service';

export enum StepName {
  Generate = 'GENERATE_APPLICATION',
  PushToGitHub = 'PUSH_TO_GITHUB',
  BuildDockerImage = 'BUILD_DOCKER'
}

export enum StepMessage {
  Generate = 'Generating Application',
  PushToGitHub = 'Push changes to GitHub',
  BuildDockerImage = 'Building Docker image'
}

export const HOST_VAR = 'HOST';
export const CLIENT_HOST_VAR = 'CLIENT_HOST';
export const BUILD_DOCKER_IMAGE_STEP_FINISH_LOG =
  'Built Docker image successfully';
export const BUILD_DOCKER_IMAGE_STEP_FAILED_LOG = 'Build Docker failed';
export const BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG =
  'Waiting for Docker image...';
export const BUILD_DOCKER_IMAGE_STEP_START_LOG =
  'Starting to build Docker image. It should take a few minutes.';

export const PUSH_TO_GITHUB_STEP_START_LOG =
  'Starting to push changes to GitHub.';
export const PUSH_TO_GITHUB_STEP_FINISH_LOG =
  'Successfully pushed changes to GitHub';
export const PUSH_TO_GITHUB_STEP_FAILED_LOG = 'Push changes to GitHub failed';

export const ACTION_ZIP_LOG = 'Creating ZIP file';
export const ACTION_JOB_DONE_LOG = 'Build job done';
export const JOB_STARTED_LOG = 'Build job started';
export const JOB_DONE_LOG = 'Build job done';
export const ENTITIES_INCLUDE = {
  fields: true,
  permissions: {
    include: {
      permissionRoles: {
        include: {
          resourceRole: true
        }
      },
      permissionFields: {
        include: {
          field: true,
          permissionRoles: {
            include: {
              resourceRole: true
            }
          }
        }
      }
    }
  }
};
export const ACTION_INCLUDE = {
  action: {
    include: {
      steps: true
    }
  }
};

const WINSTON_LEVEL_TO_ACTION_LOG_LEVEL: {
  [level: string]: EnumActionLogLevel;
} = {
  error: EnumActionLogLevel.Error,
  warn: EnumActionLogLevel.Warning,
  info: EnumActionLogLevel.Info,
  debug: EnumActionLogLevel.Debug
};

const WINSTON_META_KEYS_TO_OMIT = [LEVEL, MESSAGE, SPLAT, 'level'];

export function createInitialStepData(
  version: string,
  message: string
): Prisma.ActionStepCreateWithoutActionInput {
  return {
    message: 'Adding task to queue',
    name: 'ADD_TO_QUEUE',
    status: EnumActionStepStatus.Success,
    completedAt: new Date(),
    logs: {
      create: [
        {
          level: EnumActionLogLevel.Info,
          message: 'create build generation task',
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Build Version: ${version}`,
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Build message: ${message}`,
          meta: {}
        }
      ]
    }
  };
}
@Injectable()
export class BuildService {
  private readonly genResourceTopic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly entityService: EntityService,
    private readonly resourceRoleService: ResourceRoleService,
    private readonly actionService: ActionService,
    private readonly localDiskService: LocalDiskService,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly userService: UserService,
    private readonly buildFilesSaver: BuildFilesSaver,
    private readonly queueService: QueueService,
    private readonly buildContextStorageService: BuildContextStorageService,

    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {
    /** @todo move this to storageService config once possible */
    this.storageService.registerDriver('gcs', GoogleCloudStorage);

    this.genResourceTopic = this.configService.get('GENERATE_RESOURCE_TOPIC');
  }

  /**
   * create function creates a new build for given resource in the DB
   * @returns the build object that return after prisma.build.create
   */
  async create(args: CreateBuildArgs, skipPublish?: boolean): Promise<Build> {
    const resourceId = args.data.resource.connect.id;
    const user = await this.userService.findUser({
      where: {
        id: args.data.createdBy.connect.id
      }
    });

    //TODO
    /**@todo: set version based on release when applicable */
    const commitId = args.data.commit.connect.id;
    const version = commitId.slice(commitId.length - 8);

    const latestEntityVersions = await this.entityService.getLatestVersions({
      where: { resource: { id: resourceId } }
    });

    const build = await this.prisma.build.create({
      ...args,
      data: {
        ...args.data,
        version,
        createdAt: new Date(),
        blockVersions: {
          connect: []
        },
        entityVersions: {
          connect: latestEntityVersions.map(version => ({ id: version.id }))
        },
        action: {
          create: {
            steps: {
              create: createInitialStepData(version, args.data.message)
            }
          } //create action record
        }
      },
      include: {
        commit: true,
        resource: true
      }
    });

    const logger = this.logger.child({
      buildId: build.id
    });

    logger.info(JOB_STARTED_LOG);
    await this.generate(build, user);
    logger.info(JOB_DONE_LOG);

    return build;
  }

  async findMany(args: FindManyBuildArgs): Promise<Build[]> {
    return this.prisma.build.findMany(args);
  }

  async findOne(args: FindOneBuildArgs): Promise<Build | null> {
    return this.prisma.build.findUnique(args);
  }

  async findByRunId(runId: string): Promise<Build | null> {
    return this.prisma.build.findFirst({
      where: {
        runId
      }
    });
  }

  async logGenerateStatusByRunId(
    runId: string,
    status: BuildStatus
  ): Promise<void> {
    const build = await this.findByRunId(runId);
    const steps = await this.actionService.getSteps(build.actionId);
    const generateStep = steps.find(step => step.name === StepName.Generate);
    await this.actionService.logInfo(
      generateStep,
      `Build with id:${build.id} and runId: ${runId} status changed to ${status}`
    );
  }

  private async getGenerateCodeStepStatus(
    buildId: string
  ): Promise<ActionStep | undefined> {
    const [generateStep] = await this.prisma.build
      .findUnique({
        where: {
          id: buildId
        }
      })
      .action()
      .steps({
        where: {
          name: StepName.Generate
        }
      });

    return generateStep;
  }

  async calcBuildStatus(buildId: string): Promise<BuildStatusDto> {
    const build = await this.prisma.build.findUnique({
      where: {
        id: buildId
      },
      include: ACTION_INCLUDE
    });

    if (!build.action?.steps?.length) return BuildStatusDto.Invalid;
    const steps = build.action.steps;

    if (steps.every(step => step.status === EnumActionStepStatus.Success))
      return BuildStatusDto.Completed;

    if (steps.some(step => step.status === EnumActionStepStatus.Failed))
      return BuildStatusDto.Failed;

    return BuildStatusDto.Running;
  }

  async updateRunId(buildId: string, runId: string): Promise<void> {
    await this.prisma.build.update({
      where: { id: buildId },
      data: {
        runId: runId
      }
    });
  }

  async updateStateByRunId(runId: string, status: BuildStatus): Promise<void> {
    const build = await this.findByRunId(runId);
    await this.prisma.actionStep.updateMany({
      where: {
        actionId: build.actionId,
        name: StepName.Generate
      },
      data: {
        status: this.mapBuildStatusToActionStepStatus(status)
      }
    });
  }

  private mapBuildStatusToActionStepStatus(
    status: BuildStatus
  ): EnumActionStepStatus {
    switch (status) {
      case BuildStatus.Init:
        return EnumActionStepStatus.Running;
      case BuildStatus.InProgress:
        return EnumActionStepStatus.Running;
      case BuildStatus.Succeeded:
        return EnumActionStepStatus.Running;
      case BuildStatus.Failed:
        return EnumActionStepStatus.Failed;
      case BuildStatus.Stopped:
        return EnumActionStepStatus.Failed;
      case BuildStatus.Ready:
        return EnumActionStepStatus.Success;
    }
  }
  /**
   *
   * Give the ReadableStream of the build zip file
   * @returns the zip file of the build
   */
  async download(args: FindOneBuildArgs): Promise<NodeJS.ReadableStream> {
    const build = await this.findOne(args);
    const { id } = args.where;
    if (build === null) {
      throw new BuildNotFoundError(id);
    }

    const generatedCodeStep = await this.getGenerateCodeStepStatus(id);
    if (!generatedCodeStep) {
      throw new StepNotFoundError(StepName.Generate);
    }
    if (generatedCodeStep.status !== EnumActionStepStatus.Success) {
      throw new StepNotCompleteError(
        StepName.Generate,
        EnumActionStepStatus[generatedCodeStep.status]
      );
    }
    const filePath = getBuildZipFilePath(id);
    const disk = this.storageService.getDisk();
    const { exists } = await disk.exists(filePath);
    if (!exists) {
      throw new BuildResultNotFound(build.id);
    }
    return disk.getStream(filePath);
  }

  /**
   * Generates code for given build and saves it to storage
   * @DSG The connection between the server and the DSG (Data Service Generator)
   * @param build the build object to generate code for
   * @param user
   * @param oldBuildId
   */
  private async generate(build: Build, user: User): Promise<void> {
    return this.actionService.run(
      build.actionId,
      StepName.Generate,
      StepMessage.Generate,
      async step => {
        //#region getting all the resource data
        const entities = await this.getOrderedEntities(build.id);
        const roles = await this.getResourceRoles(build);
        const resource = await this.resourceService.resource({
          where: { id: build.resourceId }
        });
        const serviceSettings = await this.serviceSettingsService.getServiceSettingsValues(
          {
            where: { id: build.resourceId }
          },
          user
        );
        //#endregion
        const [
          dataServiceGeneratorLogger,
          logPromises
        ] = this.createDataServiceLogger(build, step);

        const host = this.configService.get(HOST_VAR);

        const url = `${host}/${build.resourceId}`;

        const buildContextData: BuildContextData = {
          entities,
          roles,
          serviceInfo: {
            name: resource.name,
            description: resource.description,
            version: build.version,
            id: build.resourceId,
            url,
            settings: serviceSettings
          }
        };

        const buildContext: BuildContext = {
          buildId: build.id,
          resourceId: build.resourceId,
          projectId: '',
          data: buildContextData
        };

        const path = await this.buildContextStorageService.saveBuildContext(
          buildContext
        );

        const generateResource: GenerateResource = {
          buildId: build.id,
          resourceId: build.resourceId,
          contextFileLocation: {
            storageType: StorageTypeEnum.FS,
            path: path
          }
        };

        this.queueService.emitMessage(
          this.genResourceTopic,
          JSON.stringify(generateResource)
        );

        await Promise.all(logPromises);

        dataServiceGeneratorLogger.destroy();

        await this.actionService.complete(step, EnumActionStepStatus.Running);
      },
      true
    );
  }

  private async getResourceRoles(build: Build): Promise<ResourceRole[]> {
    return this.resourceRoleService.getResourceRoles({
      where: {
        resource: {
          id: build.resourceId
        }
      }
    });
  }

  private createDataServiceLogger(
    build: Build,
    step: ActionStep
  ): [winston.Logger, Array<Promise<void>>] {
    const transport = new winston.transports.Console();
    const logPromises: Array<Promise<void>> = [];
    transport.on('logged', info => {
      logPromises.push(this.createLog(step, info));
    });
    return [
      winston.createLogger({
        format: this.logger.format,
        transports: [transport],
        defaultMeta: {
          buildId: build.id
        }
      }),
      logPromises
    ];
  }

  async createPR(runId: string): Promise<void> {
    const build = await this.findByRunId(runId);
    const oldBuild = await previousBuild(
      this.prisma,
      build.resourceId,
      build.id,
      build.createdAt
    );

    await this.saveToGitHub(build, oldBuild.id, null);
  }

  private async saveToGitHub(
    build: Build,
    oldBuildId: string,
    gitResourceMeta: GitResourceMeta
  ): Promise<void> {
    const resource = build.resource;
    const resourceRepository = await this.resourceService.gitRepository(
      build.resourceId
    );

    if (!resourceRepository) {
      return;
    }

    const gitOrganization = await this.resourceService.gitOrganizationByResource(
      {
        where: { id: resource.id }
      }
    );

    const commit = build.commit;
    const truncateBuildId = build.id.slice(build.id.length - 8);

    const commitMessage =
      (commit.message &&
        `${commit.message} (Amplication build ${truncateBuildId})`) ||
      `Amplication build ${truncateBuildId}`;

    const clientHost = this.configService.get(CLIENT_HOST_VAR);
    const url = `${clientHost}/${build.resourceId}/builds/${build.id}`;

    if (resourceRepository) {
      return this.actionService.run(
        build.actionId,
        StepName.PushToGitHub,
        StepMessage.PushToGitHub,
        async step => {
          await this.actionService.logInfo(step, PUSH_TO_GITHUB_STEP_START_LOG);
          try {
            const pullRequestResponse = await this.queueService.sendCreateGitPullRequest(
              {
                gitOrganizationName: gitOrganization.name,
                gitRepositoryName: resourceRepository.name,
                resourceId: build.resourceId,
                gitProvider: EnumGitProvider.Github,
                installationId: gitOrganization.installationId,
                newBuildId: build.id,
                oldBuildId,
                commit: {
                  head: `amplication-build-${build.id}`,
                  title: commitMessage,
                  body: `Amplication build # ${build.id}.
                Commit message: ${commit.message}
                
                ${url}
                `
              },
              gitResourceMeta
            }
          );

            await this.resourceService.reportSyncMessage(
              build.resourceId,
              'Sync Completed Successfully'
            );
            await this.actionService.logInfo(step, pullRequestResponse.url, {
              githubUrl: pullRequestResponse.url
            });
            await this.actionService.logInfo(
              step,
              PUSH_TO_GITHUB_STEP_FINISH_LOG
            );

            await this.actionService.complete(
              step,
              EnumActionStepStatus.Success
            );
          } catch (error) {
            await this.actionService.logInfo(
              step,
              PUSH_TO_GITHUB_STEP_FAILED_LOG
            );
            await this.actionService.logInfo(step, error);
            await this.actionService.complete(
              step,
              EnumActionStepStatus.Failed
            );
            await this.resourceService.reportSyncMessage(
              build.resourceId,
              `Error: ${error}`
            );
          }
        },
        true
      );
    }
  }

  /** @todo move */
  private getFileURL(disk: Storage, filePath: string) {
    try {
      return disk.getUrl(filePath);
    } catch (error) {
      if (error instanceof MethodNotSupported) {
        const root = this.localDiskService.getDisk().config.root;
        return path.join(root, filePath);
      }
      throw error;
    }
  }

  private async createLog(
    step: ActionStep,
    info: { message: string }
  ): Promise<void> {
    const { message, ...winstonMeta } = info;
    const level = WINSTON_LEVEL_TO_ACTION_LOG_LEVEL[info[LEVEL]];
    const meta = omit(winstonMeta, WINSTON_META_KEYS_TO_OMIT);

    await this.actionService.log(step, level, message, meta);
  }

  /**
   *
   * @info this function must always return the entities in the same order to prevent unintended code changes
   * @returns all the entities for build order by date of creation
   */
  private async getOrderedEntities(buildId: string): Promise<Entity[]> {
    const entities = await this.entityService.getEntitiesByVersions({
      where: {
        builds: {
          some: {
            id: buildId
          }
        }
      },
      include: ENTITIES_INCLUDE
    });

    return orderBy(entities, entity => entity.createdAt);
  }
  async canUserAccess({
    userId,
    buildId
  }: CanUserAccessArgs): Promise<boolean> {
    const build = this.prisma.build.findFirst({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { id: buildId, AND: { userId } }
    });
    return Boolean(build);
  }
}
