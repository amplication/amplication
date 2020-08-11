import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { StorageService } from '@codebrew/nestjs-storage';
import { createDataService, Entity } from 'amplication-data-service-generator';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

const STORAGE_DIRECTORY = 'generated-applications';

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  constructor(private readonly storageService: StorageService) {}
  @Process()
  async generate(job: Job<AppGenerationRequest>) {
    const modules = await createDataService(job.data.entities as Entity[]);
    const directory = `${STORAGE_DIRECTORY}/${job.data.id}`;
    await modules.map(module =>
      this.storageService
        .getDisk()
        .put(`${directory}/${module.path}`, module.code)
    );
  }
}
