import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { QueueService, KAFKA_CLIENT } from "./queue.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
