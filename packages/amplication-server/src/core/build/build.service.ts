import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SortOrder } from '@prisma/client';
import { Storage, MethodNotSupported } from '@slynova/flydrive';
import { GoogleCloudStorage } from '@slynova/flydrive-gcs';
import { StorageService } from '@codebrew/nestjs-storage';
import semver from 'semver';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import omit from 'lodash.omit';
import path from 'path';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { ContainerBuilderService } from 'amplication-container-builder/dist/nestjs';
import { DeployerService } from 'amplication-deployer/dist/nestjs';
import { AppRole } from 'src/models';
import { Build } from './dto/Build';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { getBuildZipFilePath, getBuildTarGzFilePath } from './storage';
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
import { ActionStep } from '../action/dto';
import { BackgroundService } from '../background/background.service';
import { createZipFileFromModules } from './zip';
import { CreateGeneratedAppDTO } from './dto/CreateGeneratedAppDTO';
import { LocalDiskService } from '../storage/local.disk.service';
import { createTarGzFileFromModules } from './tar';
import gcpDeployConfiguration from './gcp.deploy-configuration.json';

export const GENERATED_APP_BASE_IMAGE_VAR = 'GENERATED_APP_BASE_IMAGE';
export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID_VAR';
export const GENERATED_APP_BASE_IMAGE_BUILD_ARG = 'IMAGE';
export const CREATE_GENERATED_APP_PATH = '/generated-apps/';
export const GENERATE_STEP_MESSAGE = 'Generating Application';
export const BUILD_DOCKER_IMAGE_STEP_MESSAGE = 'Building Docker image';
export const BUILD_DOCKER_IMAGE_STEP_FINISH_LOG =
  'Built Docker image successfully';
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
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    private readonly entityService: EntityService,
    private readonly appRoleService: AppRoleService,
    private readonly actionService: ActionService,
    private readonly backgroundService: BackgroundService,
    private readonly containerBuilderService: ContainerBuilderService,
    private readonly deployerService: DeployerService,
    private readonly localDiskService: LocalDiskService,
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
    const filePath = getBuildZipFilePath(id);
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
      const tarballURL = await this.generate(build);
      const imageId = await this.buildDockerImage(build, tarballURL);
      await this.deploy(build, imageId);
      await this.updateStatus(buildId, EnumBuildStatus.Completed);
    } catch (error) {
      logger.error(error);
      await this.updateStatus(buildId, EnumBuildStatus.Failed);
    }

    logger.info(JOB_DONE_LOG);
  }

  /**
   * Generates code for given build and saves it to storage
   * @param build build to generate code for
   */
  private async generate(build: Build): Promise<string> {
    return this.actionService.run(
      build.actionId,
      GENERATE_STEP_MESSAGE,
      async step => {
        const entities = await this.getEntities(build.id);
        const roles = await this.getAppRoles(build);
        const [
          dataServiceGeneratorLogger,
          logPromises
        ] = this.createDataServiceLogger(build, step);

        const modules = await DataServiceGenerator.createDataService(
          entities,
          roles,
          dataServiceGeneratorLogger
        );

        await Promise.all(logPromises);

        dataServiceGeneratorLogger.destroy();

        await this.actionService.logInfo(step, ACTION_ZIP_LOG);

        const tarballURL = await this.save(build, modules);

        await this.actionService.logInfo(step, ACTION_JOB_DONE_LOG);

        return tarballURL;
      }
    );
  }

  /**
   * Builds Docker image for given build
   * Assuming build code was generated
   * @param build build to build docker image for
   */
  private async buildDockerImage(
    build: Build,
    tarballURL: string
  ): Promise<string> {
    const generatedAppBaseImage = this.configService.get(
      GENERATED_APP_BASE_IMAGE_VAR
    );
    return this.actionService.run(
      build.actionId,
      BUILD_DOCKER_IMAGE_STEP_MESSAGE,
      async step => {
        const result = await this.containerBuilderService.build(
          build.appId,
          build.id,
          tarballURL,
          {
            [GENERATED_APP_BASE_IMAGE_BUILD_ARG]: generatedAppBaseImage
          }
        );
        await this.actionService.logInfo(
          step,
          BUILD_DOCKER_IMAGE_STEP_FINISH_LOG,
          { images: result.images }
        );
        const [firstImage] = result.images;
        return firstImage;
      }
    );
  }

  private async deploy(build: Build, imageId: string): Promise<void> {
    return this.actionService.run(
      build.actionId,
      'Deploying preview service',
      async step => {
        /** @todo extract var */
        const project = this.configService.get('APPS_GCP_PROJECT_ID_VAR');
        await this.actionService.logInfo(step, 'Deploying...');
        /** @todo use environment variables */
        const backendConfiguration = {
          bucket: 'amplication-tfstate',
          prefix: build.appId
        };
        const variables = {
          project,
          region: 'us-east1',
          /* eslint-disable @typescript-eslint/naming-convention */
          app_id: build.appId,
          image_id: imageId,
          database_instance_name: 'app-database-instance'
          /* eslint-enable @typescript-eslint/naming-convention */
        };
        await this.deployerService.deploy(
          gcpDeployConfiguration,
          variables,
          backendConfiguration
        );
        await this.actionService.logInfo(step, 'Deployed successfully');
      }
    );
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

  /**
   * Saves given modules for given build as a Zip archive and tarball.
   * @param build the build to save the modules for
   * @param modules the modules to save
   * @returns created tarball URL
   */
  private async save(
    build: Build,
    modules: DataServiceGenerator.Module[]
  ): Promise<string> {
    const zipFilePath = getBuildZipFilePath(build.id);
    const tarFilePath = getBuildTarGzFilePath(build.id);
    const disk = this.storageService.getDisk();
    await Promise.all([
      createZipFileFromModules(modules).then(zip => disk.put(zipFilePath, zip)),
      createTarGzFileFromModules(modules).then(tar =>
        disk.put(tarFilePath, tar)
      )
    ]);
    return this.getFileURL(disk, tarFilePath);
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
