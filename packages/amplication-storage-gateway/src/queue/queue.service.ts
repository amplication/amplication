import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { plainToClass } from "class-transformer";
import { CHECK_USER_ACCESS_TOPIC } from "src/constants";
import assert from "assert";
import { ResultMessage } from "./dto/ResultMessage";
import { response } from "express";

export const QUEUE_SERVICE_NAME = "QUEUE_SERVICE";

@Injectable()
export class QueueService implements OnModuleInit {
  generatePullRequestTopic: string;
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaService: ClientKafka,
    configService: ConfigService
  ) {
    const envCheckUserAccessTopic = configService.get<string>(
      CHECK_USER_ACCESS_TOPIC
    );
    assert(envCheckUserAccessTopic, "Missing env for check user access topics");
    this.generatePullRequestTopic = envCheckUserAccessTopic;
  }
  onModuleInit(): void {
    this.kafkaService.subscribeToResponseOf(this.generatePullRequestTopic);
  }

  canAccessBuild(userId: string, buildId: string): Promise<boolean> {
    return new Promise((res) => {
      this.kafkaService
        .send(this.generatePullRequestTopic, { userId, buildId })
        .subscribe((response: boolean) => {
          res(response);
        });
    });
  }
}
