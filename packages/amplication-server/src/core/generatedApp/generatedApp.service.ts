import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';
import { GeneratedAppCreateInput } from './dto/GeneratedAppCreateInput';

@Injectable()
export class GeneratedAppService {
  constructor(
    @InjectQueue(QUEUE_NAME) private queue: Queue<AppGenerationRequest>
  ) {}
  async create(args: GeneratedAppCreateInput): Promise<void> {
    const request = args;
    await this.queue.add(request);
  }
}
