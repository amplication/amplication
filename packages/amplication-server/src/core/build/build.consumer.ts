import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { StorageService } from '@codebrew/nestjs-storage';
import {
  createDataService,
  Entity,
  Module
} from 'amplication-data-service-generator';
import { PrismaService } from 'src/services/prisma.service';
import { EntityService } from '..';
import { QUEUE_NAME } from './constants';
import { BuildRequest } from './dto/BuildRequest';
import { getBuildDirectory } from './storage';
import { EnumBuildStatus } from '@prisma/client';

@Processor(QUEUE_NAME)
export class BuildConsumer {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService
  ) {}

  @Process()
  async process(job: Job<BuildRequest>) {
    try {
      await this.build(job.data.id);
      await this.updateStatus(job.data.id, EnumBuildStatus.Success);
    } catch (error) {
      console.error(error);
      await this.updateStatus(job.data.id, EnumBuildStatus.Error);
    }
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

  private async build(id: string): Promise<void> {
    const build = await this.prisma.build.findOne({
      where: { id },
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
    const modules = await createDataService(entities);
    const directory = getBuildDirectory(id);
    await this.writeModules(directory, modules);
  }

  private async getBuildEntities(build: {
    entityVersions: Array<{ id: string }>;
  }): Promise<Entity[]> {
    const entityVersionIds = build.entityVersions.map(
      entityVersion => entityVersion.id
    );
    return this.entityService.getEntitiesByVersions(entityVersionIds);
  }

  private async writeModules(
    directory: string,
    modules: Module[]
  ): Promise<void> {
    const disk = this.storageService.getDisk();
    await Promise.all(
      modules.map(module =>
        disk.put(`${directory}/${module.path}`, module.code)
      )
    );
  }
}
