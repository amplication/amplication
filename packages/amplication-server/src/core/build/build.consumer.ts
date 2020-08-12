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

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService
  ) {}

  @Process()
  async build(job: Job<BuildRequest>) {
    const build = await this.prisma.build.findOne({
      where: { id: job.data.id },
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
    const entityVersionIds = build.entityVersions.map(
      entityVersion => entityVersion.id
    );
    const entities = await this.entityService.getEntitiesByVersions(
      entityVersionIds
    );
    const modules = await createDataService(entities as Entity[]);
    const directory = getBuildDirectory(job.data.id);
    this.writeModules(directory, modules);
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
