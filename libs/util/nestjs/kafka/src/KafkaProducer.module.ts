import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import {
  KafkaProducerService,
  KAFKA_PRODUCER_SERVICE_NAME,
} from "./KafkaProducer.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_PRODUCER_SERVICE_NAME,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class QueueModule {}
