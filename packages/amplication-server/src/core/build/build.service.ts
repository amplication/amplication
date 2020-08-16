import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { StorageService } from 'src/vendor/nestjs-storage';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { Build } from './dto/Build';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { getBuildFilePath } from './storage';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { BuildNotDoneError } from './errors/BuildNotDoneError';
import { BuildFailedError } from './errors/BuildFailedError';
import { EntityService } from '..';

@Injectable()
export class BuildService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly entityService: EntityService,
    @InjectQueue(QUEUE_NAME) private queue: Queue<BuildRequest>
  ) {}

  async create(args: CreateBuildArgs): Promise<Build> {
    const latestEntityVersions = await this.entityService.getLatestVersions({
      where: { app: { id: args.data.app.connect.id } }
    });
    const build = await this.prisma.build.create({
      ...args,
      data: {
        ...args.data,
        status: EnumBuildStatus.Queued,
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

  async createSignedURL(args: FindOneBuildArgs): Promise<string> {
    const build = await this.findOne(args);
    if (build === null) {
      throw new BuildNotFoundError(args.where.id);
    }
    switch (build.status) {
      case EnumBuildStatus.Queued: {
        throw new BuildNotDoneError(args.where.id);
      }
      case EnumBuildStatus.Error: {
        throw new BuildFailedError(args.where.id);
      }
    }
    const filePath = getBuildFilePath(args.where.id);
    const disk = this.storageService.getDisk();
    const response = await disk.getSignedUrl(filePath);
    return response.signedUrl;
  }
}
