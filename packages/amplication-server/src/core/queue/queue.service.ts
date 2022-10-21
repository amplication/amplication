import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { GENERATE_PULL_REQUEST_TOPIC } from '../../constants';
import assert from 'assert';
import { SendPullRequestResponse } from '../build/dto/sendPullRequestResponse';
import { SendPullRequestArgs } from '../build/dto/sendPullRequest';
import { ResultMessage } from './dto/ResultMessage';
import { StatusEnum } from './dto/StatusEnum';

export const QUEUE_SERVICE_NAME = 'QUEUE_SERVICE';
const EMPTY_REPOSITORY_ERROR = 'Git repository is empty';

@Injectable()
export class QueueService implements OnModuleInit {
  generatePullRequestTopic: string;
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaService: ClientKafka,
    configService: ConfigService
  ) {
    const envGeneratePullRequestTopic = configService.get<string>(
      GENERATE_PULL_REQUEST_TOPIC
    );
    assert(
      envGeneratePullRequestTopic,
      'Missing env for generate pull request topics'
    );
    this.generatePullRequestTopic = envGeneratePullRequestTopic;
  }
  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(this.generatePullRequestTopic);
  }

  sendCreateGitPullRequest(
    data: SendPullRequestArgs
  ): Promise<SendPullRequestResponse> {
    return new Promise((resolve, reject) => {
      this.kafkaService
        .send(this.generatePullRequestTopic, data)
        .subscribe((response: ResultMessage<SendPullRequestResponse>) => {
          if (response.status === StatusEnum.GeneralFail) {
            const resolveMessage =
              response.error === EMPTY_REPOSITORY_ERROR
                ? ' To fix this, commit a README.md file and re-build.'
                : '';
            reject(
              new Error(
                `Failed creating pull request, reason: ${response.error}.${resolveMessage}`
              )
            );
          } else if (response.value) {
            resolve(response.value);
          } else {
            reject(
              new Error(`Failed creating pull request from unknown reason`)
            );
          }
        });
    });
  }
}
