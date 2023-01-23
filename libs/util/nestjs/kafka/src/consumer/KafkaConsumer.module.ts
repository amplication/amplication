import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import {
  KafkaMessageJsonSerializer,
  KAFKA_SERIALIZER,
} from "@amplication/util/kafka";
import { Module } from "@nestjs/common";
import { ParseKafkaMessagePipe } from "../pipe/ParseKafkaMessagePipe";

@Module({
  imports: [AmplicationLoggerModule],
  providers: [
    ParseKafkaMessagePipe,
    {
      provide: KAFKA_SERIALIZER,
      useClass: KafkaMessageJsonSerializer,
    },
  ],
  exports: [ParseKafkaMessagePipe, KAFKA_SERIALIZER],
})
export class KafkaConsumerModule {}
