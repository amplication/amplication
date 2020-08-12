import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { StorageService } from '@codebrew/nestjs-storage';
import { createDataService, Entity } from 'amplication-data-service-generator';
import { QUEUE_NAME, STORAGE_DIRECTORY } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  constructor(private readonly storageService: StorageService) {}
  @Process()
  async generate(job: Job<AppGenerationRequest>) {
    const disk = this.storageService.getDisk();
    const modules = await createDataService(job.data.entities as Entity[]);
    const directory = `${STORAGE_DIRECTORY}/${job.data.id}`;
    await Promise.all(
      modules.map(module =>
        disk.put(`${directory}/${module.path}`, module.code)
      )
    );
  }
}
