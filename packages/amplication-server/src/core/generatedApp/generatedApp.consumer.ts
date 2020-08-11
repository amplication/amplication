import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { createDataService, Entity } from 'amplication-data-service-generator';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  @Process()
  async generate(job: Job<AppGenerationRequest>) {
    const modules = await createDataService(job.data.entities as Entity[]);
    console.log(job.data.id, modules);
  }
}
