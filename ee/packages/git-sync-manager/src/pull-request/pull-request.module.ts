import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { DiffModule } from "../diff/diff.module";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";

@Module({
  imports: [DiffModule, KafkaModule],
  providers: [PullRequestService],
  controllers: [PullRequestController],
})
export class PullRequestModule {}
