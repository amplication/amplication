import { Injectable } from '@nestjs/common';
import { SortOrder } from '@prisma/client';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { GoogleCloudStorage } from '@slynova/flydrive-gcs';
import { StorageService } from '@codebrew/nestjs-storage';
import semver from 'semver';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { Build } from './dto/Build';
import { PrismaService } from 'nestjs-prisma';
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

@Injectable()
export class BuildService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly entityService: EntityService,
    @InjectQueue(QUEUE_NAME) private queue: Queue<BuildRequest>
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
        }
      }
    });

    await this.queue.add({ id: build.id });
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
}
