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
import { EntityService } from '..';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';

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

  async createSignedURL(args: FindOneBuildArgs): Promise<string> {
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
    const response = await disk.getSignedUrl(filePath);
    return response.signedUrl;
  }
}
