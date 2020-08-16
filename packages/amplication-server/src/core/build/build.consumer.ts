import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted
} from '@nestjs/bull';
import { Job } from 'bull';
import { StorageService } from '@codebrew/nestjs-storage';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { PrismaService } from 'src/services/prisma.service';
import { EntityService } from '..';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { getBuildFilePath } from './storage';
import { EnumBuildStatus } from '@prisma/client';
import { createZipFileFromModules } from './zip';

@Processor(QUEUE_NAME)
export class BuildConsumer {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService
  ) {}

  @OnQueueCompleted()
  async handleQueueCompleted(job: Job<BuildRequest>): Promise<void> {
    await this.updateStatus(job.data.id, EnumBuildStatus.Success);
  }

  @OnQueueFailed()
  async handleQueueFailed(job: Job<BuildRequest>): Promise<void> {
    await this.updateStatus(job.data.id, EnumBuildStatus.Error);
  }

  @Process()
  async build(job: Job<BuildRequest>): Promise<void> {
    const { id } = job.data;
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
    const modules = await DataServiceGenerator.createDataService(entities);
    const filePath = getBuildFilePath(id);
    const disk = this.storageService.getDisk();
    const zip = await createZipFileFromModules(modules);
    await disk.put(filePath, zip);
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
  }): Promise<DataServiceGenerator.Entity[]> {
    const entityVersionIds = build.entityVersions.map(
      entityVersion => entityVersion.id
    );
    const entities = await this.entityService.getEntitiesByVersions(
      entityVersionIds
    );
    return entities as DataServiceGenerator.Entity[];
  }
}
