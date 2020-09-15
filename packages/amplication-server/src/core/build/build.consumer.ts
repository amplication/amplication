import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueActive,
  OnGlobalQueueError
} from '@nestjs/bull';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { StorageService } from '@codebrew/nestjs-storage';
import { PrismaService } from 'nestjs-prisma';
import * as winston from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { BuildLogLevel } from '@prisma/client';
import omit from 'lodash.omit';
import { EntityService } from '..';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { getBuildFilePath } from './storage';
import { createZipFileFromModules } from './zip';
import { AppRoleService } from '../appRole/appRole.service';

const WINSTON_LEVEL_TO_BUILD_LOG_LEVEL: { [level: string]: BuildLogLevel } = {
  error: 'Error',
  warn: 'Warning',
  info: 'Info',
  debug: 'Debug'
};

const WINSTON_META_KEYS_TO_OMIT = [LEVEL, MESSAGE, SPLAT];

@Processor(QUEUE_NAME)
export class BuildConsumer {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService,
    private readonly appRoleService: AppRoleService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {}

  @OnQueueCompleted()
  async handleCompleted(job: Job<BuildRequest>): Promise<void> {
    await this.updateStatus(job.data.id, EnumBuildStatus.Completed);
  }

  @OnQueueActive()
  async handleActive(job: Job<BuildRequest>): Promise<void> {
    await this.updateStatus(job.data.id, EnumBuildStatus.Active);
  }

  @OnQueueFailed()
  async handleFailed(job: Job<BuildRequest>, error: Error): Promise<void> {
    const { id } = job.data;
    this.logger.info('Build job failed', {
      buildId: id
    });
    this.logger.error(error);
    await this.updateStatus(id, EnumBuildStatus.Failed);
  }

  @OnQueuePaused()
  async handlePaused(): Promise<void> {
    await this.prisma.build.updateMany({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NOT: {
          status: {
            in: [EnumBuildStatus.Completed, EnumBuildStatus.Failed]
          }
        }
      },
      data: { status: EnumBuildStatus.Paused }
    });
  }

  @OnGlobalQueueError()
  handleError(error: Error) {
    this.logger.error(error);
  }

  @Process()
  async build(job: Job<BuildRequest>): Promise<void> {
    const { id } = job.data;
    const logger = this.logger.child({
      buildId: id
    });
    logger.info('Build job started');
    const build = await this.prisma.build.findOne({
      where: { id: id },
      include: {
        blockVersions: {
          select: {
            id: true
          }
        },
        entityVersions: {
          select: {
            id: true
          }
        }
      }
    });
    const entities = await this.getBuildEntities(build);
    const roles = await this.appRoleService.getAppRoles({
      where: {
        app: {
          id: build.appId
        }
      }
    });
    const transport = new winston.transports.Console();
    const dataServiceGeneratorLogger = winston.createLogger({
      format: this.logger.format,
      transports: [transport],
      defaultMeta: {
        buildId: id
      }
    });
    transport.on('logged', info => this.createLog(id, info));
    const modules = await DataServiceGenerator.createDataService(
      entities,
      roles,
      dataServiceGeneratorLogger
    );
    dataServiceGeneratorLogger.destroy();
    const filePath = getBuildFilePath(id);
    const disk = this.storageService.getDisk('local');
    const zip = await createZipFileFromModules(modules);
    await disk.put(filePath, zip);
    logger.info('Build job done');
  }

  private async createLog(
    buildId: string,
    info: { message: string; level: string }
  ): Promise<void> {
    const level = info[LEVEL];
    const { message, ...meta } = info;
    await this.prisma.build.update({
      where: { id: buildId },
      data: {
        logs: {
          create: {
            level: WINSTON_LEVEL_TO_BUILD_LOG_LEVEL[level],
            meta: omit(meta, WINSTON_META_KEYS_TO_OMIT),
            message
          }
        }
      }
    });
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

  private async getBuildEntities(build: {
    entityVersions: Array<{ id: string }>;
  }): Promise<DataServiceGenerator.FullEntity[]> {
    const entityVersionIds = build.entityVersions.map(
      entityVersion => entityVersion.id
    );
    const entities = await this.entityService.getEntitiesByVersions({
      where: { id: { in: entityVersionIds } },
      include: {
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
                permissionFieldRoles: {
                  include: {
                    appRole: true
                  }
                }
              }
            }
          }
        }
      }
    });
    return entities as DataServiceGenerator.FullEntity[];
  }
}
