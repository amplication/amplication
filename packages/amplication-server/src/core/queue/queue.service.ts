import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export const QUEUE_SERVICE_NAME = 'QUEUE_SERVICE';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaService: ClientKafka
  ) {}

  emitCreateGitPullRequest(data: any) {
    return this.kafkaService.emit('git.pr.generate.message', data);
  }
}
