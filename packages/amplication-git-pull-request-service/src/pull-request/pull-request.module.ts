import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { DiffModule } from "../diff/diff.module";
import { PullRequestController } from "./pull-request.controller";
import { PullRequestService } from "./pull-request.service";
import { KAFKA_CLIENT, QueueService } from "./queue.service";

@Module({
  imports: [
    DiffModule,
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [QueueService, PullRequestService],
  controllers: [PullRequestController],
})
export class PullRequestModule {}
