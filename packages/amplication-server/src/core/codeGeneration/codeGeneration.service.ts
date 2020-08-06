import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from './constants';
import { CodeGenerationRequest } from './dto/code-generation-request';

@Injectable()
export class CodeGenerationService {
  constructor(@InjectQueue(QUEUE_NAME) private queue: Queue) {}
  generate() {
    const request: CodeGenerationRequest = {};
    this.queue.add(request);
  }
}
