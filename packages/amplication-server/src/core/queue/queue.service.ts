import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  SendPullRequestArgs,
  GENERATE_PULL_REQUEST_MESSAGE,
  SendPullRequestResponse,
  ResultMessage
} from '@amplication/common';
import { plainToClass } from 'class-transformer';

export const QUEUE_SERVICE_NAME = 'QUEUE_SERVICE';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaService: ClientKafka
  ) {}
  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(GENERATE_PULL_REQUEST_MESSAGE);
  }

  emitCreateGitPullRequest(
    data: SendPullRequestArgs
  ): Promise<SendPullRequestResponse | null> {
    return new Promise(res => {
      this.kafkaService
        .send(GENERATE_PULL_REQUEST_MESSAGE, data)
        .subscribe((response: ResultMessage<SendPullRequestResponse>) => {
          try {
            const validClass = plainToClass(
              SendPullRequestResponse,
              response.value
            );
            res(validClass);
          } catch (error) {
            res(null);
          }
        });
    });
  }
}
