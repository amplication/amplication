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
  ],
  exports: [KAFKA_SERIALIZER, KafkaProducerService],
})
export class KafkaModule {}
