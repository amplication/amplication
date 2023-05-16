import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import assert from "assert";
import { CHECK_USER_ACCESS_TOPIC } from "../constants";
import { CanUserAccessBuild } from "@amplication/schema-registry";

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
    const message: CanUserAccessBuild.Value = {
      buildId,
      userId,
    };

    return new Promise((res) => {
      this.kafkaService
        .send(this.generatePullRequestTopic, message)
        .subscribe((response: boolean) => {
          res(response);
        });
    });
  }

  async connected(): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      this.kafkaService
        .emit("health.internal.storage-service.0", {
          timestamp: new Date().toISOString(),
        })
        .subscribe({
          error: (err: any) => {
            reject(err);
          },
          next: () => {
            resolve(true);
          },
        });
    });
  }
}
