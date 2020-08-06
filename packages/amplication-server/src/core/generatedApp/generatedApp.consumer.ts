import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

@Processor(QUEUE_NAME)
export class GeneratedAppConsumer {
  @Process()
  async generate(job: Job<AppGenerationRequest>) {
    console.log(job.data);
    await Promise.resolve(42);
  }
}
