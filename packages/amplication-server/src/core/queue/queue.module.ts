import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { QueueService, QUEUE_SERVICE_NAME } from "./queue.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QUEUE_SERVICE_NAME,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
