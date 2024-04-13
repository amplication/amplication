import {
  KafkaMessageJsonSerializer,
  KAFKA_SERIALIZER,
} from "@amplication/util/kafka";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import {
  createNestjsKafkaConfig,
  KAFKA_CLIENT,
} from "./createNestjsKafkaConfig";
import { KafkaProducerService } from "./producer";
import { KafkaPubSubService } from "./kafka.pubsub.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [
    {
      provide: KAFKA_SERIALIZER,
      useClass: KafkaMessageJsonSerializer,
    },
    KafkaProducerService,
    KafkaPubSubService,
  ],
  exports: [KAFKA_SERIALIZER, KafkaProducerService, KafkaPubSubService],
})
export class KafkaModule {}
