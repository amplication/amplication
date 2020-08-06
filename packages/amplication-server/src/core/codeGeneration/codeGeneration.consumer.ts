import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from './constants';
import { CodeGenerationRequest } from './dto/code-generation-request';

@Processor(QUEUE_NAME)
export class CodeGenerationConsumer {
  @Process()
  async generate(job: Job<CodeGenerationRequest>) {
    console.log(job.data);
    await Promise.resolve(42);
  }
}
