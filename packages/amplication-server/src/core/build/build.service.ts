import { Inject, Injectable } from '@nestjs/common';
import { SortOrder } from '@prisma/client';
import { GoogleCloudStorage } from '@slynova/flydrive-gcs';
import { StorageService } from '@codebrew/nestjs-storage';
import semver from 'semver';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import omit from 'lodash.omit';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { AppRole } from 'src/models';
import { Build } from './dto/Build';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { getBuildFilePath } from './storage';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { EntityService } from '..';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { DataConflictError } from 'src/errors/DataConflictError';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { EnumActionLogLevel } from '../action/dto/EnumActionLogLevel';
import { AppRoleService } from '../appRole/appRole.service';
import { ActionService } from '../action/action.service';
import { createZipFileFromModules } from './zip';
import { CreateGeneratedAppDTO } from './dto/CreateGeneratedAppDTO';
import { BackgroundService } from '../background/background.service';

export const CREATE_GENERATED_APP_PATH = '/generated-apps/';
export const ACTION_MESSAGE = 'Generating Application';
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
          appRole: true
        }
      },
      permissionFields: {
        include: {
          field: true,
          permissionRoles: {
            include: {
              appRole: true
            }
          }
        }
      }
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

export function createInitialStepData(version: string, message: string) {
  return {
    message: 'Adding task to queue',
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly entityService: EntityService,
    private readonly appRoleService: AppRoleService,
    private readonly actionService: ActionService,
    private readonly backgroundService: BackgroundService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {
    /** @todo move this to storageService config once possible */
    this.storageService.registerDriver('gcs', GoogleCloudStorage);
  }

  async create(args: CreateBuildArgs): Promise<Build> {
    const appId = args.data.app.connect.id;

    if (!semver.valid(args.data.version)) {
      throw new DataConflictError('Invalid version number');
    }

    const [lastBuild] = await this.prisma.build.findMany({
      where: {
        appId: appId
      },
      orderBy: {
        createdAt: SortOrder.desc
      },
      take: 1
    });

    if (lastBuild && !semver.gt(args.data.version, lastBuild.version)) {
      throw new DataConflictError(
        `The new version number must be larger than the last version number (>${lastBuild.version})`
      );
    }

    const latestEntityVersions = await this.entityService.getLatestVersions({
      where: { app: { id: appId } }
    });

    const build = await this.prisma.build.create({
      ...args,
      data: {
        ...args.data,
        status: EnumBuildStatus.Waiting,
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
              create: createInitialStepData(
                args.data.version,
                args.data.message
              )
            }
          } //create action record
        }
      }
    });

    const createGeneratedAppDTO: CreateGeneratedAppDTO = { buildId: build.id };

    // Queue background task and don't wait
    this.backgroundService
      .queue(CREATE_GENERATED_APP_PATH, createGeneratedAppDTO)
      .catch(this.logger.error);

    return build;
  }

  async findMany(args: FindManyBuildArgs): Promise<Build[]> {
    return this.prisma.build.findMany(args);
  }

  async findOne(args: FindOneBuildArgs): Promise<Build | null> {
    return this.prisma.build.findOne(args);
  }

  async download(args: FindOneBuildArgs): Promise<NodeJS.ReadableStream> {
    const build = await this.findOne(args);
    const { id } = args.where;
    if (build === null) {
      throw new BuildNotFoundError(id);
    }
    const status = EnumBuildStatus[build.status];
    if (status !== EnumBuildStatus.Completed) {
      throw new BuildNotCompleteError(id, status);
    }
    const filePath = getBuildFilePath(id);
    const disk = this.storageService.getDisk();
    const { exists } = await disk.exists(filePath);
    if (!exists) {
      throw new BuildResultNotFound(build.id);
    }
    return disk.getStream(filePath);
  }

  async build(buildId: string): Promise<void> {
    const build = await this.findOne({
      where: { id: buildId }
    });
    const logger = this.logger.child({
      buildId
    });
    logger.info(JOB_STARTED_LOG);
    try {
      await this.updateStatus(buildId, EnumBuildStatus.Active);
      await this.actionService.run(build.actionId, ACTION_MESSAGE);

      const entities = await this.getEntities(build.id);
      const roles = await this.getAppRoles(build);
      const dataServiceGeneratorLogger = this.createDataServiceLogger(build);

      const modules = await DataServiceGenerator.createDataService(
        entities,
        roles,
        dataServiceGeneratorLogger
      );

      dataServiceGeneratorLogger.destroy();

      await this.actionService.logInfo(build.actionId, ACTION_ZIP_LOG);

      await this.save(build, modules);

      await this.actionService.logInfo(build.actionId, ACTION_JOB_DONE_LOG);

      await this.actionService.complete(
        build.actionId,
        EnumActionStepStatus.Success
      );
      await this.updateStatus(buildId, EnumBuildStatus.Completed);
    } catch (error) {
      logger.error(error);
      await this.actionService.log(
        build.actionId,
        EnumActionLogLevel.Error,
        error
      );
      await this.actionService.complete(
        build.actionId,
        EnumActionStepStatus.Failed
      );
      await this.updateStatus(buildId, EnumBuildStatus.Failed);
    }
    logger.info(JOB_DONE_LOG);
  }

  private async updateStatus(
    id: string,
    status: EnumBuildStatus
  ): Promise<void> {
    await this.prisma.build.update({
      where: { id },
      data: {
        status
      }
    });
  }

  private async getAppRoles(build: Build): Promise<AppRole[]> {
    return this.appRoleService.getAppRoles({
      where: {
        app: {
          id: build.appId
        }
      }
    });
  }

  private createDataServiceLogger(build: Build): winston.Logger {
    const transport = new winston.transports.Console();
    transport.on('logged', info => this.createLog(build.actionId, info));
    return winston.createLogger({
      format: this.logger.format,
      transports: [transport],
      defaultMeta: {
        buildId: build.id
      }
    });
  }

  private async save(build: Build, modules: DataServiceGenerator.Module[]) {
    const filePath = getBuildFilePath(build.id);
    /** @todo use default disk */
    const disk = this.storageService.getDisk('local');
    const zip = await createZipFileFromModules(modules);
    await disk.put(filePath, zip);
  }

  private async createLog(
    actionId: string,
    info: { message: string }
  ): Promise<void> {
    const { message, ...winstonMeta } = info;
    const level = WINSTON_LEVEL_TO_ACTION_LOG_LEVEL[info[LEVEL]];
    const meta = omit(winstonMeta, WINSTON_META_KEYS_TO_OMIT);

    await this.actionService.log(actionId, level, message, meta);
  }

  private async getEntities(
    buildId: string
  ): Promise<DataServiceGenerator.Entity[]> {
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
    return entities as DataServiceGenerator.Entity[];
  }
}
