import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { createDataService } from 'amplication-data-service-generator';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  @Process()
  async generate(job: Job<AppGenerationRequest>) {
    createDataService(job.data.entities);
    await Promise.resolve(42);
  }
}
