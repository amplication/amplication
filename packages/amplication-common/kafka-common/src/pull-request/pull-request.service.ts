import { Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { PullRequestTopicsEnum } from "./";

@Injectable()
export class PullRequestKafkaService extends ClientKafka {
  emitPullRequestCreated(data: any) {
    return super.emit(PullRequestTopicsEnum.git_pr_generate, data);
  }
}
