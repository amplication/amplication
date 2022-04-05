import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  SendPullRequestArgs,
  generatePullRequestMessage
} from '@amplication/common';

export const QUEUE_SERVICE_NAME = 'QUEUE_SERVICE';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaService: ClientKafka
  ) {}
  onModuleInit() :void{
    this.kafkaService.subscribeToResponseOf(generatePullRequestMessage);
  }

  emitCreateGitPullRequest(data: SendPullRequestArgs) {
    this.kafkaService
      .send(generatePullRequestMessage, data)
      .subscribe(response => {
        console.log(response);
      });
    // return this.kafkaService.emit(generatePullRequestMessage, data);
  }
}
