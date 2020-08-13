import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { StorageService } from '@codebrew/nestjs-storage';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { Build } from './dto/Build';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { getBuildFilePath } from './storage';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';

@Injectable()
export class BuildService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    @InjectQueue(QUEUE_NAME) private queue: Queue<BuildRequest>
  ) {}

  async findMany(args: FindManyBuildArgs): Promise<Build[]> {
    return this.prisma.build.findMany(args);
  }

  async createSignedURL(args: FindOneBuildArgs): Promise<string> {
    const filePath = getBuildFilePath(args.where.id);
    const disk = this.storageService.getDisk();
    const response = await disk.getSignedUrl(filePath);
    return response.signedUrl;
  }

  async create(args: CreateBuildArgs): Promise<Build> {
    const build = await this.prisma.build.create({
      ...args,
      data: {
        ...args.data,
        status: EnumBuildStatus.Queued,
        createdAt: new Date()
      }
    });
    await this.queue.add({ id: build.id });
    return build;
  }
}
